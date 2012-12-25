import test
import bauble.db as db
from bauble.model.family import Family
from bauble.model.genus import Genus
from bauble.model.species import Species
from bauble.model.accession import Accession, AccessionNote, Verification, Voucher
from bauble.model.source import Source, SourceDetail, Collection
from bauble.model.propagation import Propagation, PlantPropagation, PropSeed, PropCutting


def test_accession_json():
    family = Family(family=test.get_random_name())
    genus_name = test.get_random_name()
    genus = Genus(family=family, genus=genus_name)
    species = Species(genus=genus, sp=test.get_random_name())
    acc = Accession(species=species, code=test.get_random_name())
    source = Source(accession=acc, sources_code=test.get_random_name())
    source.source_detail = SourceDetail(name=test.get_random_name(), description="the description")
    source.collection = Collection(locale=test.get_random_name())
    source.propagation = Propagation(prop_type='Seed')
    source.propagation._seed = PropSeed(nseeds=100, date_sown="1/1/11")

    source.plant_propagation = Propagation(prop_type='Seed')
    source.plant_propagation._seed = PropSeed(nseeds=100, date_sown="1/1/11")

    verification = Verification(accession=acc, verifier=test.get_random_name(), date="1/1/11",
                                level=1, species=species, prev_species=species)
    voucher = Voucher(accession=acc, herbarium=test.get_random_name(), code=test.get_random_name())


    note = AccessionNote(accession=acc, note="this is a test")

    session = db.connect()
    all_objs = [family, genus, species, note, acc, source]
    session.add_all(all_objs)
    session.commit()

    acc_json = acc.json(depth=0)
    assert 'ref' in acc_json
    assert acc_json['ref'] == '/accession/' + str(acc.id)

    acc_json = acc.json(depth=1)
    assert 'str' in acc_json
    assert acc_json['species'] == species.json(depth=0)

    acc_json = acc.json(depth=2)
    assert 'str' in acc_json
    # add all deph=2 fields

    note_json = note.json(depth=0)
    assert 'ref' in note_json

    note_json = note.json(depth=1)
    assert 'accession' in note_json
    assert note_json['accession'] == acc.json(depth=0)

    source_json = source.json(depth=0)
    assert 'ref' in source_json

    source_json = source.json(depth=1)
    source_json = source.json(depth=2)

    # now switch the source propagation to UnrootedCuttings
    source.propagation = Propagation(prop_type='UnrootedCutting')
    source.propagation._cutting = PropCutting()

    source.plant_propagation = Propagation(prop_type='UnrootedCutting')
    source.plant_propagation._cutting = PropCutting()

    source_json = source.json(depth=0)
    source_json = source.json(depth=1)
    source_json = source.json(depth=2)

    ver_json = verification.json(depth=0)
    ver_json = verification.json(depth=1)
    ver_json = verification.json(depth=2)

    voucher_json = voucher.json(depth=0)
    voucher_json = voucher.json(depth=1)
    voucher_json = voucher.json(depth=2)


    map(lambda o: session.delete(o), all_objs)
    session.commit()
    session.close()
