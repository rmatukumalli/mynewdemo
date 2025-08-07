import json

def get_ontology_stats():
    # Simulate API responses
    stats = {
        'capabilities': {'total': 15},
        'competencies': {'total': 25},
        'behaviors': {'total': 65},
        'skills': {'total': 90},
        'proficiencies': {'total': 350}
    }
    return json.dumps({k: v['total'] for k, v in stats.items()})

if __name__ == '__main__':
    print(get_ontology_stats())
