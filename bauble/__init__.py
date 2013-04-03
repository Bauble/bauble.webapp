
import bauble.i18n
import bauble.globals
# set up search strategies

from bauble.model import Family, Genus, Taxon, Accession, Plant, Location, \
    SourceDetail, Collection
import bauble.search as search

mapper_search = search.get_strategy('MapperSearch')
mapper_search.add_meta(('family', 'fam'), Family, ['family'])
mapper_search.add_meta(('genus', 'gen'), Genus, ['genus'])
mapper_search.add_meta(('species', 'sp'), Taxon,
                       ['sp', 'sp2', 'infrasp1', 'infrasp2',
                        'infrasp3', 'infrasp4'])
mapper_search.add_meta(('taxon', 'sp'), Taxon,
                       ['sp', 'sp2', 'infrasp1', 'infrasp2',
                        'infrasp3', 'infrasp4'])
# mapper_search.add_meta(('vernacular', 'vern', 'common'),
#                        VernacularName, ['name'])
# mapper_search.add_meta(('geography', 'geo'), Geography, ['name'])
mapper_search.add_meta(('accession', 'acc'), Accession, ['code'])
mapper_search.add_meta(('location', 'loc'), Location, ['name', 'code'])
mapper_search.add_meta(('plant', 'plants'), Plant, ['code'])
#search.add_strategy(PlantSearch)
mapper_search.add_meta(('contact', 'contacts', 'person', 'org',
                        'source'), SourceDetail, ['name'])
mapper_search.add_meta(('collection', 'col', 'coll'),
                       Collection, ['locale'])
