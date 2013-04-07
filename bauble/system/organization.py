
from sqlalchemy import *
from sqlalchemy.orm import *

import bauble.system as system

#
# Organization
#
class Organization(system.Base):
    """
    """
    __tablename__ = 'organization'
    __table_args__ = (UniqueConstraint('name'),)
    __mapper_args__ = {'order_by': ['Organization.name']}

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, index=True)
