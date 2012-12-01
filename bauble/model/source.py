#
# source.py
#
import os
import sys
import traceback
import weakref
from random import random

from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.orm.session import object_session

import bauble
import bauble.db as db
#import bauble.editor as editor
from bauble.model.geography import Geography
#import bauble.utils as utils
import bauble.types as types
#from bauble.utils.log import debug
#import bauble.view as view
#from bauble.plugins.garden.propagation import *

def coll_markup_func(coll):
    acc = coll.source.accession
    safe = utils.xml_safe_utf8
    return '%s - <small>%s</small>' %  \
        (safe(acc), safe(acc.species_str())), safe(coll)


class Source(db.Base):
    """
    """
    __tablename__ = 'source'
    sources_code = Column(Unicode(32))

    accession_id = Column(Integer, ForeignKey('accession.id'), unique=True)

    source_detail_id = Column(Integer, ForeignKey('source_detail.id'))
    source_detail = relation('SourceDetail', uselist=False,
                             backref=backref('sources',
                                             cascade='all, delete-orphan'))

    collection = relation('Collection', uselist=False,
                          cascade='all, delete-orphan',
                          backref=backref('source', uselist=False))

    # relation to a propagation that is specific to this Source and
    # not attached to a Plant
    propagation_id = Column(Integer, ForeignKey('propagation.id'))
    propagation = relation('Propagation', uselist=False, single_parent=True,
                           primaryjoin='Source.propagation_id==Propagation.id',
                           cascade='all, delete-orphan',
                           backref=backref('source', uselist=False))

    # relation to a Propagation that already exists and is attached
    # to a Plant
    plant_propagation_id = Column(Integer, ForeignKey('propagation.id'))
    plant_propagation = relation('Propagation', uselist=False,
                     primaryjoin='Source.plant_propagation_id==Propagation.id')


source_type_values = {'Expedition': _('Expedition'),
                      'GeneBank': _('Gene Bank'),
                      'BG': _('Botanic Garden or Arboretum'),
                      'Research/FieldStation': _('Research/Field Station'),
                      'Staff': _('Staff member'),
                      'UniversityDepartment': _('University Department'),
                      'Club': \
                          _('Horticultural Association/Garden Club'),
                      'MunicipalDepartment': _('Municipal department'),
                      'Commercial': _('Nursery/Commercial'),
                      'Individual': _('Individual'),
                      'Other': _('Other'),
                      'Unknown': _('Unknown'),
                     None: ''}

class SourceDetail(db.Base):
    __tablename__ = 'source_detail'
    __mapper_args__ = {'order_by': 'name'}

    name = Column(Unicode(75), unique=True)
    description = Column(UnicodeText)
    source_type = Column(types.Enum(values=source_type_values.keys(),
                                    translations=source_type_values),
                         default=None)

    def __str__(self):
        return utils.utf8(self.name)


# TODO: should provide a collection type: alcohol, bark, boxed,
# cytological, fruit, illustration, image, other, packet, pollen,
# print, reference, seed, sheet, slide, transparency, vertical,
# wood.....see HISPID standard, in general need to be more herbarium
# aware

# TODO: create a DMS column type to hold latitude and longitude,
# should probably store the DMS data as a string in decimal degrees
class Collection(db.Base):
    """
    :Table name: collection

    :Columns:
            *collector*: :class:`sqlalchemy.types.Unicode`

            *collectors_code*: :class:`sqlalchemy.types.Unicode`

            *date*: :class:`sqlalchemy.types.Date`

            *locale*: :class:`sqlalchemy.types.UnicodeText`

            *latitude*: :class:`sqlalchemy.types.Float`

            *longitude*: :class:`sqlalchemy.types.Float`

            *gps_datum*: :class:`sqlalchemy.types.Unicode`

            *geo_accy*: :class:`sqlalchemy.types.Float`

            *elevation*: :class:`sqlalchemy.types.Float`

            *elevation_accy*: :class:`sqlalchemy.types.Float`

            *habitat*: :class:`sqlalchemy.types.UnicodeText`

            *geography_id*: :class:`sqlalchemy.types.Integer`

            *notes*: :class:`sqlalchemy.types.UnicodeText`

            *accession_id*: :class:`sqlalchemy.types.Integer`


    :Properties:


    :Constraints:
    """
    __tablename__ = 'collection'

    # columns
    collector = Column(Unicode(64))
    collectors_code = Column(Unicode(50))
    date = Column(types.Date)
    locale = Column(UnicodeText, nullable=False)
    latitude = Column(Unicode(15))
    longitude = Column(Unicode(15))
    gps_datum = Column(Unicode(32))
    geo_accy = Column(Float)
    elevation = Column(Float)
    elevation_accy = Column(Float)
    habitat = Column(UnicodeText)
    notes = Column(UnicodeText)

    geography_id = Column(Integer, ForeignKey('geography.id'))
    region = relation(Geography, uselist=False)

    source_id = Column(Integer, ForeignKey('source.id'), unique=True)

    def __str__(self):
        return _('Collection at %s') % (self.locale or repr(self))
