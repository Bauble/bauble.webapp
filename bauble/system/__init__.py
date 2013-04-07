
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
import sqlalchemy.orm as orm


db_uri = 'sqlite:///system.db'
"""
"""

engine = None
"""A :class:`sqlalchemy.engine.base.Engine` used as the default
connection to the database.
"""

Session = None

Base = declarative_base()
"""
An instance of :class:`sqlalchemy.ext.declarative.Base`
"""


def connect():
    global engine, Session
    engine = sa.create_engine(db_uri)
    Session = orm.sessionmaker(bind=engine)
    return Session()
