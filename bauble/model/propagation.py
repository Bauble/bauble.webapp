# -*- coding: utf-8 -*-
#
# propagation module
#

import datetime
import os
from random import random
import re
import sys
import weakref
import traceback
import xml.sax.saxutils as saxutils

import dateutil.parser as date_parser
from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.orm.session import object_session
from sqlalchemy.exc import DBAPIError

import bauble
import bauble.db as db
#from bauble.error import check
#import bauble.utils as utils
import bauble.paths as paths
#import bauble.editor as editor
#from bauble.utils.log import debug
#import bauble.prefs as prefs
from bauble.error import CommitException
import bauble.types as types


prop_type_values = {'Seed': _("Seed"),
                    'UnrootedCutting': _('Unrooted cutting'),
                    'Other': _('Other')}

class PlantPropagation(db.Base):
    """
    PlantPropagation provides an intermediate relation from
    Plant->Propagation
    """
    __tablename__ = 'plant_prop'
    plant_id = Column(Integer, ForeignKey('plant.id'), nullable=False)
    propagation_id = Column(Integer, ForeignKey('propagation.id'),
                            nullable=False)

    propagation = relation('Propagation', uselist=False)
    plant = relation('Plant', uselist=False)


    def json(self, depth=1):
        """
        """
        d = self.propagation.json(depth)
        d['ref'] = '/plant/' + str(self.plant_id) + d['ref]']
        return d



class Propagation(db.Base):
    """
    Propagation
    """
    __tablename__ = 'propagation'
    #recvd_as = Column(Unicode(10)) # seed, urcu, other
    #recvd_as_other = Column(UnicodeText) # ** maybe this should be in the notes
    prop_type = Column(types.Enum(values=prop_type_values.keys(),
                                  translations=prop_type_values),
                       nullable=False)
    notes = Column(UnicodeText)
    date = Column(types.Date)

    _cutting = relation('PropCutting',
                      primaryjoin='Propagation.id==PropCutting.propagation_id',
                      cascade='all,delete-orphan', uselist=False,
                      backref=backref('propagation', uselist=False))
    _seed = relation('PropSeed',
                     primaryjoin='Propagation.id==PropSeed.propagation_id',
                     cascade='all,delete-orphan', uselist=False,
                     backref=backref('propagation', uselist=False))

    def _get_details(self):
        if self.prop_type == 'Seed':
            return self._seed
        elif self.prop_type == 'UnrootedCutting':
            return self._cutting
        elif self.notes:
            return self.notes
        else:
            raise NotImplementedError

    #def _set_details(self, details):
    #    return self._details

    details = property(_get_details)

    def get_summary(self):
        """
        """
        # TODO: need a date format string from the settings
        # date_format = prefs.prefs[prefs.date_format_pref]
        date_format = '%d-%m-%Y'

        def get_date(date):
            if isinstance(date, datetime.date):
                return date.strftime(date_format)
            return date

        s = str(self)
        if self.prop_type == 'UnrootedCutting':
            c = self._cutting
            values = []
            if c.cutting_type is not None:
                values.append(_('Cutting type: %s') % \
                                  cutting_type_values[c.cutting_type])
            if c.length:
                values.append(_('Length: %(length)s%(unit)s') %
                              dict(length=c.length,
                                   unit=length_unit_values[c.length_unit]))
            if c.tip:
                values.append(_('Tip: %s') % tip_values[c.tip])
            if c.leaves:
                s = _('Leaves: %s') % leaves_values[c.leaves]
                if c.leaves == 'Removed' and c.leaves_reduced_pct:
                    s.append('(%s%%)' % c.leaves_reduced_pct)
                values.append(s)
            if c.flower_buds:
                values.append(_('Flower buds: %s') % \
                                  flower_buds_values[c.flower_buds])
            if c.wound is not None:
                values.append(_('Wounded: %s' % wound_values[c.wound]))
            if c.fungicide:
                values.append(_('Fungal soak: %s' % c.fungicide))
            if c.hormone:
                values.append(_('Hormone treatment: %s' % c.hormone))
            if c.bottom_heat_temp:
                values.append(_('Bottom heat: %(temp)s%(unit)s') %
                               dict(temp=c.bottom_heat_temp,
                                    unit=bottom_heat_unit_values[c.bottom_heat_unit]))
            if c.container:
                values.append(_('Container: %s' % c.container))
            if c.media:
                values.append(_('Media: %s' % c.media))
            if c.location:
                values.append(_('Location: %s' % c.location))
            if c.cover:
                values.append(_('Cover: %s' % c.cover))

            if c.rooted_pct:
                values.append(_('Rooted: %s%%') % c.rooted_pct)
            s = ', '.join(values)
        elif self.prop_type == 'Seed':
            s = str(self)
            seed = self._seed
            values = []
            if seed.pretreatment:
                values.append(_('Pretreatment: %s') % seed.pretreatment)
            if seed.nseeds:
                values.append(_('# of seeds: %s') % seed.nseeds)
            date_sown = get_date(seed.date_sown)
            if date_sown:
                values.append(_('Date sown: %s') % date_sown)
            if seed.container:
                values.append(_('Container: %s') % seed.container)
            if seed.media:
                values.append(_('Media: %s') % seed.media)
            if seed.covered:
                values.append(_('Covered: %s') % seed.covered)
            if seed.location:
                values.append(_('Location: %s') % seed.location)
            germ_date = get_date(seed.germ_date)
            if germ_date:
                values.append(_('Germination date: %s') % germ_date)
            if seed.nseedlings:
                values.append(_('# of seedlings: %s') % seed.nseedlings)
            if seed.germ_pct:
                values.append(_('Germination rate: %s%%') % seed.germ_pct)
            date_planted = get_date(seed.date_planted)
            if date_planted:
                values.append(_('Date planted: %s') % date_planted)
            s = ', '.join(values)
        elif self.notes:
            s = utils.utf8(self.notes)

        return s


    def json(self, depth=1):
        d = dict(ref="/propagation/" + str(self.id))
        if depth > 0:
            d['prop_type'] = self.prop_type
            if self.prop_type == 'UnrootedCutting':
                d.update(self._json_cutting(depth))
            elif self.prop_type == 'Seed':
                d.update(self._json_seed(depth))


    def _json_cutting(self, depth):
        d = dict()
        d['cutting_type'] = self._cutting.cutting_type
        d['tip'] = self._cutting.tip
        d[' leaves'] = self._cutting.leaves
        d['leaves_reduced_pct'] = self._cutting.leaves_reduced_pct
        d['length'] = self._cutting.length
        d['length_unit'] = self._cutting.length_unit

        # single/double/slice
        d['wound'] = self._cutting.wound

        # removed/None
        d['flower_buds'] = self._cutting.flower_buds

        d['fungicide'] = self._cutting.fungicide  # fungal soak
        d['hormone'] = self._cutting.hormone  # powder/liquid/None....solution

        d['media'] = self._cutting.media
        d['container'] = self._cutting.container
        d['location'] = self._cutting.location
        d['cover'] = self._cutting.cover  # vispore, poly, plastic dome, poly bag

        d['bottom_heat_temp'] = self._cutting.bottom_heat_temp  # temperature of bottom heat

        # F/C
        d['bottom_heat_unit'] = self._cutting.bottom_heat_unit
        d['rooted_pct'] = self._cutting.rooted_pct

        d['rooted'] = []
        for rooted in self._cutting.rooted:
            d['rooted'].append(dict(date=rooted.date, quantity=rooted.quantity))

        return d


    def _json_seed(self, depth):
        d = dict()
        d['pretreatment'] = self._seed.pretreatment
        d['nseeds'] = self._seed.nseeds
        d['date_sown'] = self._seed.date_sown
        d['container'] = self._seed.container
        d['media'] = self._seed.media
        d['covered'] = self._seed.covered
        d['location'] = self._seed.location
        d['moved_from'] = self._seed.moved_from
        d['moved_to'] = self._seed.moved_to
        d['moved_date'] = self._seed.moved_date
        d['germ_date'] = self._seed.germ_date
        d['nseedlings'] = self._seed.nseedlings
        d['germ_pct'] = self._seed.germ_pct
        d['date_planted'] = self._seed.date_planted
        return d



class PropRooted(db.Base):
    """
    Rooting dates for cutting
    """
    __tablename__ = 'prop_cutting_rooted'
    __mapper_args__ = {'order_by': 'date'}

    date = Column(types.Date)
    quantity = Column(Integer, autoincrement=False)
    cutting_id = Column(Integer, ForeignKey('prop_cutting.id'), nullable=False)



cutting_type_values = {'Nodal': _('Nodal'),
                       'InterNodal': _('Internodal'),
                       'Other': _('Other')}

tip_values = {'Intact': _('Intact'),
              'Removed': _('Removed'),
              'None': _('None'),
              None: ''}

leaves_values = {'Intact': _('Intact'),
                 'Removed': _('Removed'),
                 'None': _('None'),
                 None: ''}

flower_buds_values = {'Removed': _('Removed'),
                      'None': _('None'),
                      None: ''}

wound_values = {'No': _('No'),
                'Single': _('Singled'),
                'Double': _('Double'),
                'Slice': _('Slice'),
                None: ''}

hormone_values = {'Liquid': _('Liquid'),
                  'Powder': _('Powder'),
                  'No': _('No')}

bottom_heat_unit_values = {'F': _('\302\260F'),
                           'C': _('\302\260C'),
                           None: ''}

length_unit_values = {'mm': _('mm'),
                      'cm': _('cm'),
                      'in': _('in'),
                      None: ''}

class PropCutting(db.Base):
    """
    A cutting
    """
    __tablename__ = 'prop_cutting'
    cutting_type = Column(types.Enum(values=cutting_type_values.keys(),
                                     translations=cutting_type_values),
                          default='Other')
    tip = Column(types.Enum(values=tip_values.keys(),
                            translations=tip_values))
    leaves = Column(types.Enum(values=leaves_values.keys(),
                               translations=leaves_values))
    leaves_reduced_pct = Column(Integer, autoincrement=False)
    length = Column(Integer, autoincrement=False)
    length_unit = Column(types.Enum(values=length_unit_values.keys(),
                                    translations=length_unit_values))

    # single/double/slice
    wound = Column(types.Enum(values=wound_values.keys(),
                              translations=wound_values))

    # removed/None
    flower_buds = Column(types.Enum(values=flower_buds_values.keys(),
                                    translations=flower_buds_values))

    fungicide = Column(Unicode) # fungal soak
    hormone = Column(Unicode) # powder/liquid/None....solution

    media = Column(Unicode)
    container = Column(Unicode)
    location = Column(Unicode)
    cover = Column(Unicode) # vispore, poly, plastic dome, poly bag

    bottom_heat_temp = Column(Integer, autoincrement=False) # temperature of bottom heat

    # TODO: make the bottom heat unit required if bottom_heat_temp is
    # not null

    # F/C
    bottom_heat_unit = Column(types.Enum(values=bottom_heat_unit_values.keys(),
                                         translations=bottom_heat_unit_values),
                              nullable=True)
    rooted_pct = Column(Integer, autoincrement=False)
    #aftercare = Column(UnicodeText) # same as propgation.notes

    propagation_id = Column(Integer, ForeignKey('propagation.id'),
                            nullable=False)

    rooted = relation('PropRooted', cascade='all,delete-orphan',
                        backref=backref('cutting', uselist=False))


class PropSeed(db.Base):
    """
    """
    __tablename__ = 'prop_seed'
    pretreatment = Column(UnicodeText)
    nseeds = Column(Integer, nullable=False, autoincrement=False)
    date_sown = Column(types.Date, nullable=False)
    container = Column(Unicode) # 4" pot plug tray, other
    media = Column(Unicode) # seedling media, sphagnum, other

    # covered with #2 granite grit: no, yes, lightly heavily
    covered = Column(Unicode)

    # not same as location table, glasshouse(bottom heat, no bottom
    # heat), polyhouse, polyshade house, fridge in polybag
    location = Column(Unicode)

    # TODO: do we need multiple moved to->moved from and date fields
    moved_from = Column(Unicode)
    moved_to = Column(Unicode)
    moved_date = Column(types.Date)

    germ_date = Column(types.Date)

    nseedlings = Column(Integer, autoincrement=False) # number of seedling
    germ_pct = Column(Integer, autoincrement=False) # % of germination
    date_planted = Column(types.Date)

    propagation_id = Column(Integer, ForeignKey('propagation.id'),
                            nullable=False)


    def __str__(self):
        # what would the string be...???
        # cuttings of self.accession.species_str() and accession number
        return repr(self)
