
from sqlalchemy import *
from sqlalchemy.orm import *

import bauble.system as system

#
# User
#
class User(system.Base):
    """
    """
    __tablename__ = 'user'
    __table_args__ = (UniqueConstraint('name'),)
    __mapper_args__ = {'order_by': ['User.name']}

    # columns
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(32), nullable=False, index=True)
    password = Column(String(32), nullable=False)
    organization = Column(String)

    last_accessed = Column(DateTime)
    token = Column(String(32))
