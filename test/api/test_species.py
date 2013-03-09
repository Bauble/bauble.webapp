import test
import bauble.db as db
from bauble.model.family import Family
from bauble.model.genus import Genus
from bauble.model.species import Species, SpeciesSynonym, SpeciesNote

def test_species_json():
    family = Family(family=test.get_random_name())
    genus_name = test.get_random_name()
    genus = Genus(family=family, genus=genus_name)
    sp_name = test.get_random_name()
    species = Species(genus=genus, sp=sp_name)

    note = SpeciesNote(species=species, note="this is a test")
    syn = SpeciesSynonym(species=species, synonym=species)

    session = db.connect()
    session.add_all([family, genus, species, note, syn])
    session.commit()

    species_json = species.json(depth=0)
    assert 'ref' in species_json
    assert species_json['ref'] == '/taxon/' + str(species.id)

    species_json = species.json(depth=1)
    assert 'str' in species_json
    assert 'id' in species_json
    assert species_json['genus'] == genus.json(depth=0)

    species_json = species.json(depth=2)
    assert 'str' in species_json
    # add all deph=2 fields

    note_json = note.json(depth=0)
    assert 'ref' in note_json

    note_json = note.json(depth=1)
    assert 'taxon' in note_json
    assert note_json['taxon'] == species.json(depth=0)

    syn_json = syn.json(depth=0)
    assert 'ref' in syn_json

    syn_json = syn.json(depth=1)
    assert syn_json['taxon'] == species.json(depth=0)
    assert syn_json['synonym'] == species.json(depth=0)

    map(lambda o: session.delete(o), [family, genus, species])
    session.commit()
    session.close()


def test_server():
    """
    Test the server properly handle /taxon resources
    """

    family = test.create_resource('/family', {'family': test.get_random_name()})
    genus = test.create_resource('/genus', {'genus': test.get_random_name(),
        'family': family})

    # create a taxon taxon
    first_taxon = test.create_resource('/taxon',
        {'sp': test.get_random_name(), 'genus': genus})

    # create another taxon and use the first as a synonym
    data = {'sp': test.get_random_name(), 'genus': genus
            # 'notes': [{'user': 'me', 'category': 'test', 'date': '1/1/2001', 'note': 'test note'},
            #           {'user': 'me', 'category': 'test', 'date': '2/2/2001', 'note': 'test note2'}],
            # 'synonyms': [{'synonym': first_taxon}]
            }

    second_taxon = test.create_resource('/taxon', data)
    assert 'ref' in second_taxon  # created

    # update the taxon
    second_taxon['taxon'] = test.get_random_name()
    second_ref = second_taxon['ref']
    second_taxon = test.update_resource(second_taxon)
    assert second_taxon['ref'] == second_ref  # make sure they have the same ref after the update

    # get the taxon
    first_taxon = test.get_resource(first_taxon['ref'])

    # query for taxa
    print('second_taxon', second_taxon)
    response_json = test.query_resource('/taxon', q=data['sp'])
    print(response_json)
    second_taxon = response_json['results'][0]  # we're assuming there's only one
    assert second_taxon['ref'] == second_ref

    # test getting the species relative to its family
    response_json = test.get_resource(family['ref'] + "/genera/species")
    taxa = response_json['results']
    assert first_taxon['ref'] in [taxon['ref'] for taxon in taxa]

    # delete the created resources
    test.delete_resource(first_taxon['ref'])
    test.delete_resource(second_taxon['ref'])
    test.delete_resource(genus)
    test.delete_resource(family)
