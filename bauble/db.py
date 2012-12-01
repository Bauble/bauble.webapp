
import datetime

import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta
import sqlalchemy.orm as orm

import bauble.types as types

"""
"""

def initialize():
    from sqlalchemy import create_engine
    global engine, Session, metadata
    engine = create_engine('sqlite:///test.db')#, echo=True)
    Session = orm.sessionmaker(bind=engine)    


class HistoryExtension(orm.MapperExtension):
    """
    HistoryExtension is a
    :class:`~sqlalchemy.orm.interfaces.MapperExtension` that is added
    to all clases that inherit from bauble.db.Base so that all
    inserts, updates, and deletes made to the mapped objects are
    recorded in the `history` table.
    """
    def _add(self, operation, mapper, instance):
        """
        Add a new entry to the history table.
        """
        user = None
        try:
            if engine.name in ('postgres', 'postgresql'):
                import bauble.plugins.users as users
                user = users.current_user()
        except:
            if 'USER' in os.environ and os.environ['USER']:
                user = os.environ['USER']
            elif 'USERNAME' in os.environ and os.environ['USERNAME']:
                user = os.environ['USERNAME']

        row = {}
        for c in mapper.local_table.c:
            row[c.name] = getattr(instance, c.name)
        table = History.__table__
        table.insert(dict(table_name=mapper.local_table.name,
                          table_id=instance.id, values=str(row),
                          operation=operation, user=user,
                          timestamp=datetime.datetime.today())).execute()


    def after_update(self, mapper, connection, instance):
        self._add('update', mapper, instance)


    def after_insert(self, mapper, connection, instance):
        self._add('insert', mapper, instance)


    def after_delete(self, mapper, connection, instance):
        self._add('delete', mapper, instance)



class MapperBase(DeclarativeMeta):
    """
    MapperBase adds the id, _created and _last_updated columns to all
    tables.

    In general there is no reason to use this class directly other
    than to extend it to add more default columns to all the bauble
    tables.
    """
    def __init__(cls, classname, bases, dict_):
        if '__tablename__' in dict_:
            cls.id = sa.Column('id', sa.Integer, primary_key=True,
                               autoincrement=True)
            cls._created = sa.Column('_created', types.DateTime(True),
                                     default=sa.func.now())
            cls._last_updated = sa.Column('_last_updated', types.DateTime(True),
                                          default=sa.func.now(),
                                          onupdate=sa.func.now())

            # cls.__mapper_args__ = {'extension': HistoryExtension()}

        super(MapperBase, cls).__init__(classname, bases, dict_)





engine = None
"""A :class:`sqlalchemy.engine.base.Engine` used as the default
connection to the database.
"""


Session = None
"""
bauble.db.Session is created after the database has been opened with
:func:`bauble.db.open()`. bauble.db.Session should be used when you need
to do ORM based activities on a bauble database.  To create a new
Session use::Uncategorized

    session = bauble.db.Session()

When you are finished with the session be sure to close the session
with :func:`session.close()`. Failure to close sessions can lead to
database deadlocks, particularly when using PostgreSQL based
databases.
"""

Base = declarative_base(metaclass=MapperBase)
"""
All tables/mappers in Bauble which use the SQLAlchemy declarative
plugin for declaring tables and mappers should derive from this class.

An instance of :class:`sqlalchemy.ext.declarative.Base`
"""


metadata = Base.metadata
"""The default metadata for all Bauble tables.

An instance of :class:`sqlalchemy.schema.Metadata`
"""


history_base = declarative_base(metadata=metadata)

class History(history_base):
    """
    The history table records ever changed made to every table that
    inherits from :ref:`Base`

    :Table name: history

    :Columns:
      id: :class:`sqlalchemy.types.Integer`
        A unique identifier.
      table_name: :class:`sqlalchemy.types.String`
        The name of the table the change was made on.
      table_id: :class:`sqlalchemy.types.Integer`
        The id in the table of the row that was changed.
      values: :class:`sqlalchemy.types.String`
        The changed values.
      operation: :class:`sqlalchemy.types.String`
        The type of change.  This is usually one of insert, update or delete.
      user: :class:`sqlalchemy.types.String`
        The name of the user who made the change.
      timestamp: :class:`sqlalchemy.types.DateTime`
        When the change was made.
    """
    __tablename__ = 'history'
    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    table_name = sa.Column(sa.String, nullable=False)
    table_id = sa.Column(sa.Integer, nullable=False, autoincrement=False)
    values = sa.Column(sa.String, nullable=False)
    operation = sa.Column(sa.String, nullable=False)
    user = sa.Column(sa.String)
    timestamp = sa.Column(types.DateTime, nullable=False)
