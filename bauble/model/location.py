#
# location.py
#
import os
import traceback

from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.orm.session import object_session
from sqlalchemy.exc import DBAPIError

import bauble
import bauble.db as db

#import bauble.utils as utils
import bauble.paths as paths


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
        return dict(id=self.id,
                    code=self.code,
                    name=self.name,
                    description=self.description)
