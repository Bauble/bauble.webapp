#
# utils module
#
"""
A common set of utility functions used throughout Bauble.
"""
import datetime
import imp
import os
import re
import sys
import textwrap
import xml.sax.saxutils as saxutils

import bauble
from bauble.error import check, CheckConditionError
import bauble.paths as paths
#from bauble.utils.log import debug, warning


def find_dependent_tables(table, metadata=None):
    '''
    Return an iterator with all tables that depend on table.  The
    tables are returned in the order that they depend on each
    other. For example you know that table[0] does not depend on
    tables[1].

    :param table: The tables who dependencies we want to find

    :param metadata: The :class:`sqlalchemy.engine.MetaData` object
      that holds the tables to search through.  If None then use
      bauble.db.metadata
    '''
    # NOTE: we can't use bauble.metadata.sorted_tables here because it
    # returns all the tables in the metadata even if they aren't
    # dependent on table at all
    from sqlalchemy.sql.util import sort_tables
    if metadata is None:
        import bauble.db as db
        metadata = db.metadata
    tables = []
    def _impl(t2):
        for tbl in metadata.sorted_tables:
            for fk in tbl.foreign_keys:
                if fk.column.table == t2 and tbl not in tables \
                        and tbl is not table:
                    tables.append(tbl)
                    _impl(tbl)
    _impl(table)
    return sort_tables(tables=tables)



def prettify_format(format):
    """
    Return the date format in a more human readable form.
    """
    f = format.replate('%Y', 'yyyy')
    f = f.replace('%m', 'mm')
    f = f.replace('%d', 'dd')
    return f


def today_str(format=None):
    """
    Return a string for of today's date according to format.

    If format=None then the format uses the prefs.date_format_pref
    """
    import bauble.prefs as prefs
    if not format:
        format = prefs.prefs[prefs.date_format_pref]
    import datetime
    today = datetime.date.today()
    return today.strftime(format)


def xml_safe(obj, encoding='utf-8'):
    '''
    Return a string with character entities escaped safe for xml, if the
    str parameter is a string a string is returned, if str is a unicode object
    then a unicode object is returned
    '''
    obj = to_unicode(obj, encoding)
    return saxutils.escape(obj)


def xml_safe_utf8(obj):
    """
    This method is deprecated and just returns xml_safe(obj)
    """
    return xml_safe(obj)


__natsort_rx = re.compile('(\d+(?:\.\d+)?)')

def natsort_key(obj):
    """
    a key getter for sort and sorted function

    the sorting is done on return value of obj.__str__() so we can sort
    objects as well, i don't know if this will cause problems with unicode

    use like: sorted(some_list, key=utils.natsort_key)
    """
    # TODO: what happens with natsort and unicode characters
    item = str(obj)
    chunks = __natsort_rx.split(item)
    for ii in range(len(chunks)):
        if chunks[ii] and chunks[ii][0] in '0123456789':
            if '.' in chunks[ii]:
                numtype = float
            else:
                numtype = int
            # wrap in tuple with '0' to explicitly specify numbers come first
            chunks[ii] = (0, numtype(chunks[ii]))
        else:
            chunks[ii] = (1, chunks[ii])
    return (chunks, item)



def delete_or_expunge(obj):
    """
    If the object is in object_session(obj).new then expunge it from the
    session.  If not then session.delete it.
    """
    from sqlalchemy.orm import object_session
    session = object_session(obj)
    if session is None:
        return
    if obj in session.new:
#        debug('expunge obj: %s -- %s' % (obj, repr(obj)))
        session.expunge(obj)
        del obj
    else:
#        debug('delete obj: %s -- %s' % (obj, repr(obj)))
        session.delete(obj)


def reset_sequence(column):
    """
    If column.sequence is not None or the column is an Integer and
    column.autoincrement is true then reset the sequence for the next
    available value for the column...if the column doesn't have a
    sequence then do nothing and return

    The SQL statements are executed directly from db.engine

    This function only works for PostgreSQL database.  It does nothing
    for other database engines.
    """
    import bauble
    import bauble.db as db
    from sqlalchemy.types import Integer
    from sqlalchemy import schema
    if not db.engine.name == 'postgresql':
        return

    sequence_name = None
    if hasattr(column,'default') and isinstance(column.default,schema.Sequence):
        sequence_name = column.default.name
    elif (isinstance(column.type, Integer) and column.autoincrement) and \
            (column.default is None or \
                 (isinstance(column.default, schema.Sequence) and \
                      column.default.optional)) and \
                      len(column.foreign_keys)==0:
        sequence_name = '%s_%s_seq' %(column.table.name, column.name)
    else:
        return
    conn = db.engine.connect()
    trans = conn.begin()
    try:
        # the FOR UPDATE locks the table for the transaction
        stmt = "SELECT %s from %s FOR UPDATE;" %(column.name, column.table.name)
        result = conn.execute(stmt)
        maxid = None
        vals = list(result)
        if vals:
            maxid = max(vals, key=lambda x: x[0])[0]
        result.close()
        if maxid == None:
            # set the sequence to nextval()
            stmt = "SELECT nextval('%s');" % (sequence_name)
        else:
            stmt = "SELECT setval('%s', max(%s)+1) from %s;" \
                % (sequence_name, column.name, column.table.name)
        conn.execute(stmt)
    except Exception as e:
        warning('bauble.utils.reset_sequence(): %s' % utf8(e))
        trans.rollback()
    else:
        trans.commit()
    finally:
        conn.close()


def enum_values_str(col):
    """
    :param col: a string if table.col where col is an enum type

    return a string with of the values on an enum type join by a comma
    """
    import bauble.db as db
    table_name, col_name = col.split('.')
    #debug('%s.%s' % (table_name, col_name))
    values = db.metadata.tables[table_name].c[col_name].type.values[:]
    if None in values:
        values[values.index(None)] = '&lt;None&gt;'
    return ', '.join(values)


def which(filename, path=None):
    """
    Return first occurence of file on the path.
    """
    if not path:
        path = os.environ['PATH'].split(os.pathsep)
    for dirname in path:
        candidate = os.path.join(dirname, filename)
        if os.path.isfile(candidate):
            return candidate
    return None


def ilike(col, val, engine=None):
    """
    Return a cross platform ilike function.
    """
    from sqlalchemy import func
    if not engine:
        engine = bauble.db.engine
    if engine.name == 'postgresql':
        return col.op('ILIKE')(val)
    else:
        return func.lower(col).like(func.lower(val))



def range_builder(text):
    """Return a list of numbers from a string range of the form 1-3,4,5
    """
    from pyparsing import Word, Group, Suppress, delimitedList, nums, \
        ParseException, ParseResults
    rng = Group(Word(nums) + Suppress('-') + Word(nums))
    range_list = delimitedList(rng | Word(nums))

    token = None
    try:
        tokens = range_list.parseString(text)
    except (AttributeError, ParseException) as e:
        return []
    values = set()
    for rng in tokens:
        if isinstance(rng, ParseResults):
            # get here if the token is a range
            start = int(rng[0])
            end = int(rng[1]) + 1
            check(start<end, 'start must be less than end')
            values.update(range(start, end))
        else:
            # get here if the token is an integer
            values.add(int(rng))
    return list(values)


def gc_objects_by_type(tipe):
    """
    Return a list of objects from the garbage collector by type.
    """
    import inspect
    import gc
    if isinstance(tipe, str):
        return [o for o in gc.get_objects() if type(o).__name__ == tipe]
    elif inspect.isclass(tipe):
        return [o for o in gc.get_objects() if isinstance(o, tipe)]
    else:
        return [o for o in gc.get_objects() if isinstance(o, type(tipe))]


def mem(size="rss"):
    """Generalization; memory sizes: rss, rsz, vsz."""
    import os
    return int(os.popen('ps -p %d -o %s | tail -1' % \
                            (os.getpid(), size)).read())


#
# This implementation of topological sort was taken directly from...
# http://www.bitformation.com/art/python_toposort.html
#
def topological_sort(items, partial_order):
    """
    Perform topological sort.

    :param items: a list of items to be sorted.
    :param partial_order: a list of pairs. If pair (a,b) is in it, it
        means that item a should appear before item b. Returns a list of
        the items in one of the possible orders, or None if partial_order
        contains a loop.
    """
    def add_node(graph, node):
        """Add a node to the graph if not already exists."""
        if node not in graph:
            graph[node] = [0] # 0 = number of arcs coming into this node.
    def add_arc(graph, fromnode, tonode):
        """
        Add an arc to a graph. Can create multiple arcs. The end nodes must
        already exist.
        """
        graph[fromnode].append(tonode)
        # Update the count of incoming arcs in tonode.
        graph[tonode][0] = graph[tonode][0] + 1

    # step 1 - create a directed graph with an arc a->b for each input
    # pair (a,b).
    # The graph is represented by a dictionary. The dictionary contains
    # a pair item:list for each node in the graph. /item/ is the value
    # of the node. /list/'s 1st item is the count of incoming arcs, and
    # the rest are the destinations of the outgoing arcs. For example:
    # {'a':[0,'b','c'], 'b':[1], 'c':[1]}
    # represents the graph: c <-- a --> b
    # The graph may contain loops and multiple arcs.
    # Note that our representation does not contain reference loops to
    # cause GC problems even when the represented graph contains loops,
    # because we keep the node names rather than references to the nodes.
    graph = {}
    for v in items:
        add_node(graph, v)
    for a,b in partial_order:
        add_arc(graph, a, b)

    # Step 2 - find all roots (nodes with zero incoming arcs).
    roots = [node for (node,nodeinfo) in graph.items() if nodeinfo[0] == 0]

    # step 3 - repeatedly emit a root and remove it from the graph. Removing
    # a node may convert some of the node's direct children into roots.
    # Whenever that happens, we append the new roots to the list of
    # current roots.
    sorted = []
    while len(roots) != 0:
        # If len(roots) is always 1 when we get here, it means that
        # the input describes a complete ordering and there is only
        # one possible output.
        # When len(roots) > 1, we can choose any root to send to the
        # output; this freedom represents the multiple complete orderings
        # that satisfy the input restrictions. We arbitrarily take one of
        # the roots using pop(). Note that for the algorithm to be efficient,
        # this operation must be done in O(1) time.
        root = roots.pop()
        sorted.append(root)
        for child in graph[root][1:]:
            graph[child][0] = graph[child][0] - 1
            if graph[child][0] == 0:
                roots.append(child)
        del graph[root]
    if len(graph.items()) != 0:
        # There is a loop in the input.
        return None
    return sorted


def get_distinct_values(column, session):
    """
    Return a list of all the distinct values in a table column
    """
    q = session.query(column).distinct()
    return [v[0] for v in q if v != (None,)]


def get_invalid_columns(obj, ignore_columns=['id']):
    """
    Return column names on a mapped object that have values
    which aren't valid for the model.

    Invalid columns meet the following criteria:
    - nullable columns with null values
    - ...what else?
    """
    # TODO: check for invalid enum types
    if not obj:
        return []
    from sqlalchemy.orm import object_mapper
    table = obj.__table__
    invalid_columns = []
    #for column in filter(lambda c: c.name not in ignore_columns, table.c):
    for column in [c for c in table if c.name not in ignore_columns]:
        v = getattr(obj, column.name)
        #debug('%s.%s = %s' % (table.name, column.name, v))
        if v is None and not column.nullable:
            invalid_columns.append(column.name)
    return invalid_columns


def get_urls(text):
    """
    Return tuples of http/https links and labels for the links.  To
    label a link prefix it with [label text],
    e.g. [BBG]http://belizebotanic.org
    """
    rx = re.compile('(?:\[(.+?)\])?((?:(?:http)|(?:https))://\S+)', re.I)
    matches = []
    for match in rx.finditer(text):
        #print match.groups()
        matches.append(match.groups())
    return matches
