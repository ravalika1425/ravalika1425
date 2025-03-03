export function findChildrenByType(root, type) {
    return findChildren({
      candidates: [root],
      predicate: (o) => o.type === type,
    });
  }

  function findChildren({ candidates , predicate, results = [] }) {
    if (!candidates.length) {
      return results;
    }
  
    const candidate = candidates.shift();
    if (predicate(candidate)) {
      results.push(candidate);
    }
  
    candidates = candidates.concat(candidate.children);
    return findChildren({ candidates, predicate, results });
  }
  export function findChildByName(root, name) {
    return findChild({
      candidates: [root],
      predicate: (o) => o.name === name,
    });
  }

  export function findChild({ candidates, predicate }) {
    if (!candidates.length) {
      return null;
    }
  
    const candidate = candidates.shift();
    if (predicate(candidate)) return candidate;
  
    candidates = candidates.concat(candidate.children);
    return findChild({ candidates, predicate })};
