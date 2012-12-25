
import test
import bauble.db as db
from bauble.model.family import Family, FamilySynonym, FamilyNote


def test_family_json():
    family_name = test.get_random_name()
    family = Family(family=family_name)
    note = FamilyNote(family=family, note="this is a test")
    syn = FamilySynonym(family=family, synonym=family)

    session = db.connect()
    session.add_all([family, note, syn])
    session.commit()

    family_json = family.json(depth=0)
    assert 'ref' in family_json
    assert family_json['ref'] == '/family/' + str(family.id)

    family_json = family.json(depth=1)
    assert 'family' in family_json
    assert 'str' in family_json
    assert 'qualifier' in family_json

    note_json = note.json(depth=0)
    assert 'ref' in note_json

    note_json = note.json(depth=1)
    assert 'family' in note_json
    assert note_json['family'] == family.json(depth=0)

    syn_json = syn.json(depth=0)
    assert 'ref' in syn_json

    syn_json = syn.json(depth=1)
    assert syn_json['family'] == family.json(depth=0)
    assert syn_json['synonym'] == family.json(depth=0)

    session.delete(family)
    session.commit()
    session.close()


