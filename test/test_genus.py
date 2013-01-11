import test
import bauble.db as db
from bauble.model.family import Family
from bauble.model.genus import Genus, GenusSynonym, GenusNote


def test_genus_json():
    family = Family(family=test.get_random_name())
    genus_name = test.get_random_name()
    genus = Genus(family=family, genus=genus_name)
    note = GenusNote(genus=genus, note="this is a test")
    syn = GenusSynonym(genus=genus, synonym=genus)

    session = db.connect()
    session.add_all([family, genus, note, syn])
    session.commit()

    genus_json = genus.json(depth=0)
    assert 'ref' in genus_json
    assert genus_json['ref'] == '/genus/' + str(genus.id)

    genus_json = genus.json(depth=1)
    assert 'genus' in genus_json
    assert 'str' in genus_json
    assert 'qualifier' in genus_json

    note_json = note.json(depth=0)
    assert 'ref' in note_json

    note_json = note.json(depth=1)
    assert 'genus' in note_json
    assert note_json['genus'] == genus.json(depth=0)

    syn_json = syn.json(depth=0)
    assert 'ref' in syn_json

    syn_json = syn.json(depth=1)
    assert syn_json['genus'] == genus.json(depth=0)
    assert syn_json['synonym'] == genus.json(depth=0)

    session.delete(genus)
    session.commit()
    session.close()


def test_server():
    """
    Test the server properly handle /genus resources
    """

    family = test.create_resource('/family', {'family': test.get_random_name()})

    # create a genus genus
    first_genus = test.create_resource('/genus',
        {'genus': test.get_random_name(), 'family': family})

    # create another genus and use the first as a synonym
    data = {'genus': test.get_random_name(), 'family': family
            # 'notes': [{'user': 'me', 'category': 'test', 'date': '1/1/2001', 'note': 'test note'},
            #           {'user': 'me', 'category': 'test', 'date': '2/2/2001', 'note': 'test note2'}],
            # 'synonyms': [{'synonym': first_genus}]
            }

    second_genus = test.create_resource('/genus', data)
    assert 'ref' in second_genus  # created

    # update the genus
    second_genus['genus'] = test.get_random_name()
    second_ref = second_genus['ref']
    second_genus = test.update_resource(second_genus)
    assert second_genus['ref'] == second_ref  # make sure they have the same ref after the update

    # get the genus
    first_genus = test.get_resource(first_genus['ref'])

    # query for genera
    response_json = test.query_resource('/genus', q=second_genus['genus'])
    print(response_json)
    second_genus = response_json['results'][0]  # we're assuming there's only one
    assert second_genus['ref'] == second_ref

    # delete the created resources
    test.delete_resource(first_genus['ref'])
    test.delete_resource(second_genus['ref'])
    test.delete_resource(family)
