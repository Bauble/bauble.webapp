
import random

import pytest
from sqlalchemy.exc import *
from sqlalchemy.orm.exc import *

import bauble.db as db
from bauble.model import *

import test.schema as test

session = None

@pytest.fixture
def family(request):
    global session
    session = db.connect()
    family = Family(family=test.random_string())
    session.add(family)
    session.commit()

    def finalize():
        session.delete(family)
        session.close()
    request.addfinalizer(finalize)

    return family


def test_cascades(family):
    """
    Test that cascading is set up properly
    """
    genus = Genus(family_id=family.id, genus=test.random_string())
    session.add(genus)
    session.commit()

    # test that deleting a family deletes an orphaned genus
    session.delete(family)
    session.commit()
    query = session.query(Genus).filter_by(family_id=family.id)

    with pytest.raises(NoResultFound):
        query.one()


def test_synonyms(family):
    """
    Test that Family.synonyms works correctly
    """
    family2 = Family(family=test.random_string())
    family.synonyms.append(family2)
    session.add(family2)
    session.commit()

    # test that family2 was added as a synonym to family
    parentFamily = session.query(Family).filter_by(family=family.family).one()
    assert family2 in parentFamily.synonyms

    # test that the synonyms relation and family backref works
    assert family._synonyms[0].family == parentFamily
    assert family._synonyms[0].synonym == family2

    # test that the synonyms are removed properly
    family.synonyms.remove(family2)
    session.commit()
    assert family2 not in family.synonyms

    # test synonyms contraints, e.g that a family cannot have the
    # same synonym twice
    family.synonyms.append(family2)
    session.commit()
    family.synonyms.append(family2)

    with pytest.raises(IntegrityError):
        session.commit()

    session.rollback()

    # test that clearing all the synonyms works
    family.synonyms.clear()
    session.commit()
    assert len(family.synonyms) == 0
    #assert session.query(FamilySynonym).count() == 0

    # test that deleting a family that is a synonym of another family
    # deletes all the dangling object
    family.synonyms.append(family2)
    session.commit()
    session.delete(family2)
    session.commit()
    assert len(family.synonyms) == 0
    #assert session.query(FamilySynonym).count() == 0

    # test that deleting the previous synonyms didn't delete the
    # family that it refered to
    assert session.query(Family).get(family.id)

    # test that deleting a family that has synonyms deletes all
    # the synonyms that refer to that family
    family3 = Family(family=test.random_string())
    family4 = Family(family=test.random_string())
    family3.synonyms.append(family4)
    session.add_all([family3, family4])
    session.commit()
    assert session.query(FamilySynonym).filter_by(family_id=family3.id).count() == 1
    session.delete(family3)
    session.commit()
    assert session.query(FamilySynonym).filter_by(family_id=family3.id).count() == 0


def test_constraints():
    """
    Test that the family constraints were created correctly
    """
    session = db.connect()
    family_name = test.random_string()
    values = [dict(family=family_name),
              dict(family=family_name, qualifier='s. lat.')]

    # fail with two families that have the same name and same qualifiers
    session.add(Family(**values[0]))
    session.add(Family(**values[0]))
    with pytest.raises(IntegrityError):
        session.commit()

    session.rollback()

    # fail with two families that have the same name and same qualifiers
    session.add(Family(**values[1]))
    session.add(Family(**values[1]))
    with pytest.raises(IntegrityError):
        session.commit()

    session.rollback()

    # verify that a family can have the same name as long as the qualifier is different
    # fail with two families that have the same name and same qualifiers
    family = Family(**values[0])
    family2 = Family(**values[1])
    session.add_all([family, family2])
    session.commit()
    session.delete(family)
    session.delete(family2)
    session.commit()

    # test that family cannot be null
    session.add(Family(family=None))
    with pytest.raises(IntegrityError):
        session.commit()

    session.rollback()
    session.close()


def test_str():
    """
    Test that the family str function works as expected
    """
    f = Family()
    assert str(f) == repr(f)
    family_name = test.random_string()
    f = Family(family=family_name)
    assert str(f) == family_name
    f.qualifier = 's. lat.'
    assert str(f) == family_name + ' s. lat.'
