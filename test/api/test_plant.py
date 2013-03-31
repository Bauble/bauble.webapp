import api as test
import bauble.db as db
from bauble.model.family import Family
from bauble.model.genus import Genus
from bauble.model.species import Species
from bauble.model.accession import Accession
from bauble.model.plant import Plant, PlantNote
from bauble.model.location import Location



def test_plant_json():
    family = Family(family=test.get_random_name())
    genus_name = test.get_random_name()
    genus = Genus(family=family, genus=genus_name)
    species = Species(genus=genus, sp=test.get_random_name())
    acc = Accession(species=species, code=test.get_random_name())
    location = Location(code=test.get_random_name())
    plant = Plant(accession=acc, code=test.get_random_name(), quantity=1, location=location)

    note = PlantNote(plant=plant, note="this is a test")

    session = db.connect()
    all_objs = [family, genus, species, note, acc, plant, location]
    session.add_all(all_objs)
    session.commit()

    plant_json = plant.json(depth=0)
    assert 'ref' in plant_json
    assert plant_json['ref'] == '/plant/' + str(plant.id)

    plant_json = plant.json(depth=1)
    assert 'str' in plant_json

    plant_json = plant.json(depth=2)

    # add all deph=2 fields

    note_json = note.json(depth=0)
    assert 'ref' in note_json

    note_json = note.json(depth=1)
    assert 'plant' in note_json
    assert note_json['plant'] == plant.json(depth=0)

    map(lambda o: session.delete(o), all_objs)
    session.commit()
    session.close()


def test_server():
    """
    Test the server properly handle /taxon resources
    """

    family = test.create_resource('/family', {'family': test.get_random_name()})
    genus = test.create_resource('/genus', {'genus': test.get_random_name(),
        'family': family})
    taxon = test.create_resource('/taxon', {'genus': genus, 'sp': test.get_random_name()})
    accession = test.create_resource('/accession',
        {'taxon': taxon, 'code': test.get_random_name()})
    location = test.create_resource('/location', {'code': test.get_random_name()})

    plant = test.create_resource('/plant',
        {'accession': accession, 'location': location, 'code': test.get_random_name(),
         'quantity': 10})

    assert 'ref' in plant  # created
    plant_ref = plant['ref']
    plant['code'] = test.get_random_name()
    plant = test.update_resource(plant)
    assert plant['ref'] == plant_ref

    # get the plant
    plant = test.get_resource(plant['ref'])

    # query for plants
    response_json = test.query_resource('/plant', q=plant['code'])
    plant = response_json['results'][0]  # we're assuming there's only one
    assert plant['ref'] == plant_ref

    # delete the created resources
    test.delete_resource(plant)
    test.delete_resource(location)
    test.delete_resource(accession)
    test.delete_resource(taxon)
    test.delete_resource(genus)
    test.delete_resource(family)

