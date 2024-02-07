const hashMap = () => {
  let buckets = [];
  const loadFactor = 0.75;
  let capacity = 16;

  function hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i += 1) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
    }
    return hashCode;
  }

  function set(key, value) {
    grow();
    const hashCode = hash(key);

    function linkRecursive(node) {
      if (node[key]) {
        node[key] = value;
        return;
      }
      if (!node.next) {
        node.next = {};
        node.next[key] = value;
        return;
      }
      linkRecursive(node.next);
    }

    if (!buckets[hashCode]) {
      buckets[hashCode] = {};
      buckets[hashCode][key] = value;
    } else {
      linkRecursive(buckets[hashCode]);
    }
  }

  function get(key) {
    const hashCode = hash(key);

    function getRecursive(node) {
      if (node[key]) return node[key];
      if (!node.next) return null;
      return getRecursive(node.next);
    }

    if (!buckets[hashCode]) return null;
    return getRecursive(buckets[hashCode]);
  }

  function has(key) {
    const hashCode = hash(key);

    function hasRecursive(node) {
      if (node[key]) return true;
      if (!node.next) return false;
      return hasRecursive(node.next);
    }

    if (!buckets[hashCode]) return false;
    return hasRecursive(buckets[hashCode]);
  }

  function remove(key) {
    const hashCode = hash(key);

    function removeRecursive(node) {
      if (node[key]) {
        delete node[key];
        if (!node.next) return true;
        const nextKeys = Object.keys(node.next);
        for (let i = 0; i < nextKeys.length; i += 1) {
          node[nextKeys[i]] = node.next[nextKeys[i]];
        }
        return true;
      }
      if (!node.next) return false;
      return removeRecursive(node.next);
    }

    if (!buckets[hashCode]) return false;
    return removeRecursive(buckets[hashCode]);
  }

  function length() {
    let count = 0;

    function countRecursive(node) {
      if (!node) return;
      count += 1;
      countRecursive(node.next);
    }

    for (let i = 0; i < buckets.length; i += 1) {
      countRecursive(buckets[i]);
    }
    return count;
  }

  function clear() {
    buckets = [];
  }

  function keys() {
    const allKeys = [];

    function keysRecursive(node) {
      if (!node) return;
      const nodeKey = Object.keys(node).filter((key) => key !== 'next')[0];
      allKeys.push(nodeKey);
      keysRecursive(node.next);
    }

    for (let i = 0; i < buckets.length; i += 1) {
      keysRecursive(buckets[i]);
    }
    return allKeys;
  }

  function values() {
    const allValues = [];

    function valuesRecursive(node) {
      if (!node) return;
      const nodeKey = Object.keys(node).filter((key) => key !== 'next')[0];
      allValues.push(node[nodeKey]);
      valuesRecursive(node.next);
    }

    for (let i = 0; i < buckets.length; i += 1) {
      valuesRecursive(buckets[i]);
    }

    return allValues;
  }

  function entries() {
    const allPairs = [];

    function entriesRecursive(node) {
      if (!node) return;
      const nodeKey = Object.keys(node).filter((key) => key !== 'next')[0];
      allPairs.push([nodeKey, node[nodeKey]]);
      entriesRecursive(node.next);
    }

    for (let i = 0; i < buckets.length; i += 1) {
      entriesRecursive(buckets[i]);
    }

    return allPairs;
  }

  function grow() {
    const allPairs = entries();
    if ((allPairs.length / capacity) < loadFactor) return;
    capacity += 16;
    clear();

    for (let i = 0; i < allPairs.length; i += 1) {
      set(allPairs[i][0], allPairs[i][1]);
    }
  }

  return {
    hash, set, get, has, remove, length, clear, keys, values, entries,
  };
};
