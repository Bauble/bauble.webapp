import test
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
