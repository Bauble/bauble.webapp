#

# Genera table module
#

import os
import traceback
import weakref
import xml

from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.orm.session import object_session
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.associationproxy import association_proxy

import bauble
import bauble.db as db
#import bauble.utils as utils
#import bauble.utils.desktop as desktop
import bauble.types as types
#from bauble.utils.log import debug
import bauble.paths as paths
#from bauble.prefs import prefs

from bauble.model.family import Family

# TODO: warn the user that a duplicate genus name is being entered
# even if only the author or qualifier is different

# TODO: should be a higher_taxon column that holds values into
# subgen, subfam, tribes etc, maybe this should be included in Genus

# TODO: since there can be more than one genus with the same name but
# different authors we need to show the Genus author in the result
# search, we should also check if when entering a plantname with a
# chosen genus if that genus has an author ask the user if they want
# to use the accepted name and show the author of the genus then so
# they aren't using the wrong version of the Genus, e.g. Cananga


def genus_markup_func(genus):
    '''
    '''
    # TODO: the genus should be italicized for markup
    return utils.xml_safe(genus), utils.xml_safe(genus.family)



class Genus(db.Base):
    """
    :Table name: genus

    :Columns:
        *genus*:
            The name of the genus.  In addition to standard generic
            names any additional hybrid flags or genera should included here.

        *qualifier*:
            Designates the botanical status of the genus.

            Possible values:
                * s. lat.: aggregrate genus (sensu lato)

                * s. str.: segregate genus (sensu stricto)

        *author*:
            The name or abbreviation of the author who published this genus.

    :Properties:
        *family*:
            The family of the genus.

        *synonyms*:
            The list of genera who are synonymous with this genus.  If
            a genus is listed as a synonym of this genus then this
            genus should be considered the current and valid name for
            the synonym.

    :Contraints:
        The combination of genus, author, qualifier
        and family_id must be unique.
    """
    __tablename__ = 'genus'
    __table_args__ = (UniqueConstraint('genus', 'author',
                                       'qualifier', 'family_id'),
                      {})
    __mapper_args__ = {'order_by': ['genus', 'author']}

    # columns
    genus = Column(String(64), nullable=False, index=True)

    # use '' instead of None so that the constraints will work propertly
    author = Column(Unicode(255), default='')
    qualifier = Column(types.Enum(values=['s. lat.', 's. str', '']),
                       default='')

    family_id = Column(Integer, ForeignKey('family.id'), nullable=False)
    genera = relation('Family', backref=backref('genera', cascade='all,delete-orphan'))

    # relations
    synonyms = association_proxy('_synonyms', 'synonym')
    _synonyms = relation('GenusSynonym',
                         primaryjoin='Genus.id==GenusSynonym.genus_id',
                         cascade='all, delete-orphan', uselist=True,
                         backref='genus')

    # this is a dummy relation, it is only here to make cascading work
    # correctly and to ensure that all synonyms related to this genus
    # get deleted if this genus gets deleted
    __syn = relation('GenusSynonym',
                     primaryjoin='Genus.id==GenusSynonym.synonym_id',
                     cascade='all, delete-orphan', uselist=True)


    def __str__(self):
        return Genus.str(self)


    @staticmethod
    def str(genus, author=False):
        # TODO: the genus should be italicized for markup
        if genus.genus is None:
            return repr(genus)
        elif not author or genus.author is None:
            return ' '.join([s for s in [genus.genus, genus.qualifier] \
                                 if s not in ('', None)])
        else:
            return ' '.join(
                [s for s in [genus.genus, genus.qualifier,
                             xml.sax.saxutils.escape(genus.author)] \
                     if s not in ('', None)])



class GenusNote(db.Base):
    """
    Notes for the genus table
    """
    __tablename__ = 'genus_note'
    __mapper_args__ = {'order_by': 'genus_note.date'}

    date = Column(types.Date, default=func.now())
    user = Column(Unicode(64))
    category = Column(Unicode(32))
    note = Column(UnicodeText, nullable=False)
    genus_id = Column(Integer, ForeignKey('genus.id'), nullable=False)
    genus = relation('Genus', uselist=False,
                      backref=backref('notes', cascade='all, delete-orphan'))


class GenusSynonym(db.Base):
    """
    :Table name: genus_synonym
    """
    __tablename__ = 'genus_synonym'

    # columns
    genus_id = Column(Integer, ForeignKey('genus.id'), nullable=False)

    # a genus can only be a synonum of one other genus
    synonym_id = Column(Integer, ForeignKey('genus.id'), nullable=False,
                        unique=True)

    # relations
    synonym = relation('Genus', uselist=False,
                       primaryjoin='GenusSynonym.synonym_id==Genus.id')

    def __init__(self, synonym=None, **kwargs):
        # it is necessary that the first argument here be synonym for
        # the Genus.synonyms association_proxy to work
        self.synonym = synonym
        super(GenusSynonym, self).__init__(**kwargs)

    def __str__(self):
        return str(self.synonym)


# TODO: could probably incorporate this into the class since if we can 
# avoid using the Species class name in the order_by
Genus.species = relation('Species', cascade='all, delete-orphan',
                         #order_by=[Species.sp],
                         backref=backref('genus', uselist=False))
