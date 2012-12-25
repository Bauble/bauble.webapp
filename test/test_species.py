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
    assert species_json['ref'] == '/species/' + str(species.id)

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
    assert 'species' in note_json
    assert note_json['species'] == species.json(depth=0)

    syn_json = syn.json(depth=0)
    assert 'ref' in syn_json

    syn_json = syn.json(depth=1)
    assert syn_json['species'] == species.json(depth=0)
    assert syn_json['synonym'] == species.json(depth=0)

    map(lambda o: session.delete(o), [family, genus, species])
    session.commit()
    session.close()
