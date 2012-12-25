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


