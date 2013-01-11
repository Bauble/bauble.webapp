
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


def test_server():
    """
    Test the server properly handle /family resources
    """
    # create a family family
    first_family = test.create_resource('/family', {'family': test.get_random_name()})

    # create another family and use the first as a synonym
    data = {'family': test.get_random_name(),
            'notes': [{'user': 'me', 'category': 'test', 'date': '1/1/2001', 'note': 'test note'},
                      {'user': 'me', 'category': 'test', 'date': '2/2/2001', 'note': 'test note2'}],
            'synonyms': [{'synonym': first_family}]
            }

    second_family = test.create_resource('/family', data)
    assert 'ref' in second_family  # created

    # update the family
    second_family['family'] = test.get_random_name()
    second_ref = second_family['ref']
    second_family = test.update_resource(second_family)
    assert second_family['ref'] == second_ref  # make sure they have the same ref after the update

    # get the family
    first_family = test.get_resource(first_family['ref'])

    # query for families
    response_json = test.query_resource('/family', q=second_family['family'])
    second_family = response_json['results'][0]  # we're assuming there's only one
    assert second_family['ref'] == second_ref

    # delete the created resources
    test.delete_resource(first_family['ref'])
    test.delete_resource(second_family['ref'])
