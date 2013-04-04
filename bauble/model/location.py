#
# location.py
#
from sqlalchemy import *
from sqlalchemy.orm import *

import bauble.db as db


def loc_markup_func(location):
    if location.description is not None:
        return utils.xml_safe(str(location)), \
            utils.xml_safe(str(location.description))
    else:
        return utils.xml_safe(str(location))


class Location(db.Base):
    """
    :Table name: location

    :Columns:
        *name*:

        *description*:

    :Relation:
        *plants*:

    """
    __tablename__ = 'location'
    __mapper_args__ = {'order_by': 'name'}

    # columns
    # refers to beds by unique codes
    code = Column(Unicode(10), unique=True, nullable=False)
    name = Column(Unicode(64))
    description = Column(UnicodeText)

    # relations
    plants = relation('Plant', backref=backref('location', uselist=False))

    def __str__(self):
        if self.name:
            return '(%s) %s' % (self.code, self.name)
        else:
            return str(self.code)


    def json(self, depth=1):
        d = dict(ref="/location/" + str(self.id))
        if depth > 0:
            d['id'] = self.id
            d['code'] = self.code
            d['name'] = self.name
            d['str'] = str(self)
        if depth > 1:
            d['description'] = self.description

        return d
