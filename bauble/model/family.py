#
# Family table definition
#
import json
import os
import traceback
import weakref

from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.orm.session import object_session
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.associationproxy import association_proxy

import bauble
import bauble.db as db
#import bauble.utils.desktop as desktop
#import bauble.utils as utils
#from bauble.utils.log import debug
#import bauble.utils.web as web
import bauble.types as types
#from bauble.prefs import prefs


def family_markup_func(family):
    """
    return a string or object with __str__ method to use to markup
    text in the results view
    """
    return family


#
# Family
#
class Family(db.Base):
    """
    :Table name: family

    :Columns:
        *family*:
            The name if the family. Required.

        *qualifier*:
            The family qualifier.

            Possible values:
                * s. lat.: aggregrate family (senso lato)

                * s. str.: segregate family (senso stricto)

                * '': the empty string

        *notes*:
            Free text notes about the family.

    :Properties:
        *synonyms*:
            An association to _synonyms that will automatically
            convert a Family object and create the synonym.

    :Constraints:
        The family table has a unique constraint on family/qualifier.
    """
    __tablename__ = 'family'
    __table_args__ = (UniqueConstraint('family', 'qualifier'), {})
    __mapper_args__ = {'order_by': ['Family.family', 'Family.qualifier']}

    # columns
    family = Column(String(45), nullable=False, index=True)

    # we use the blank string here instead of None so that the
    # contraints will work properly,
    qualifier = Column(types.Enum(values=['s. lat.', 's. str.', '']),
                       default='')

    # relations
    synonyms = association_proxy('_synonyms', 'synonym')
   #genera = relation('Genus', backref='family', cascade='all, delete-orphan')
    _synonyms = relation('FamilySynonym',
                          primaryjoin='Family.id==FamilySynonym.family_id',
                          cascade='all, delete-orphan', uselist=True,
                          backref='family')

    # this is a dummy relation, it is only here to make cascading work
    # correctly and to ensure that all synonyms related to this family
    # get deleted if this family gets deleted
    __syn = relation('FamilySynonym',
                     primaryjoin='Family.id==FamilySynonym.synonym_id',
                     cascade='all, delete-orphan', uselist=True)

    def __str__(self):
        return Family.str(self)

    @staticmethod
    def str(family, qualifier=False):
        if family.family is None:
            return repr(family)
        else:
            return ' '.join([s for s in [family.family,
                                    family.qualifier] if s not in (None, '')])

    def json(self, depth=1, markup=True):
        """Return a dictionary representation of the Family.

        Kwargs:
           depth (int): The level of detail to return in the dict
           markup (bool): Whether the returned str should include markup.  This
                          parameter is only relevant with a depth>0
        Returns:
           dict.
        """
        d = dict(ref="/family/" + str(self.id))
        if(depth > 0):
            d['family'] = self.family
            d['qualifier'] = self.qualifier
            d['str'] = str(self)
            d['resource'] = 'family'

        if(depth > 1):
            d['synonyms'] = [syn.json(depth=depth - 1) for syn in self.synonyms]
            d['notes'] = [note.json(depth=depth - 1) for note in self.notes]

        return d


class FamilyNote(db.Base):
    """
    Notes for the family table
    """
    __tablename__ = 'family_note'

    date = Column(types.Date, default=func.now())
    user = Column(Unicode(64))
    category = Column(Unicode(32))
    note = Column(UnicodeText, nullable=False)
    family_id = Column(Integer, ForeignKey('family.id'), nullable=False)
    family = relation('Family', uselist=False,
                      backref=backref('notes', cascade='all, delete-orphan'))


    def json(self, depth=1):
        """Return a JSON representation of this FamilyNote
        """
        d = dict(ref="/family/" + str(self.family_id) + "/note/" + str(self.id))
        if(depth > 0):
            d['date'] = self.date
            d['user'] = self.user
            d['category'] = self.category
            d['note'] = self.note
            d['family'] = self.family.json(depth=depth - 1)
        return d



class FamilySynonym(db.Base):
    """
    :Table name: family_synonyms

    :Columns:
        *family_id*:

        *synonyms_id*:

    :Properties:
        *synonyms*:

        *family*:
    """
    __tablename__ = 'family_synonym'

    # columns
    family_id = Column(Integer, ForeignKey('family.id'), nullable=False)
    synonym_id = Column(Integer, ForeignKey('family.id'), nullable=False,
                        unique=True)

    # relations
    synonym = relation('Family', uselist=False,
                       primaryjoin='FamilySynonym.synonym_id==Family.id')

    def __init__(self, synonym=None, **kwargs):
        # it is necessary that the first argument here be synonym for
        # the Family.synonyms association_proxy to work
        self.synonym = synonym
        super(FamilySynonym, self).__init__(**kwargs)


    def __str__(self):
        return Family.str(self.synonym)


    def json(self, depth=1):
        """Return a JSON representation of this FamilySynonym
        """
        d = dict(ref="/family/" + str(self.family_id) + "/synonym/" + str(self.id))
        if(depth > 0):
            d['family'] = self.family.json(depth=depth - 1)
            d['synonym'] = self.synonym.json(depth=depth - 1)
        return d
