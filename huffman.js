

/* Takes a string and returns a map of characters in the
 * text to the number of times that the character occured
 * in the text
 */
function calcFreqs(text) {
    return _.reduce(_.toArray(text), function(freqs, chr) {
        if (_.has(freqs, chr)) {
            freqs[chr]++;
        } else {
            freqs[chr] = 1;
        };
        
        return freqs;
    }, {});
};

/*
 * Takes a frequency map returned from calcFreqs
 * and returns an array of Huffman tree leaf nodes,
 * or a Huffman forest
 */
function toForest(freqs) {
    return _.map(freqs, function(freq, chr) { 
        return {
            chr: chr,
            freq: freq,
            left: null,
            right: null
        };
    });
};

/* Takes a huffman forest combines the two 
 * nodes with the lowest frequency values 
 * that are roots of trees in the forest
 * and adds the new root to the forest array
 */
function combineLowest(forest) {
    var sorted = _.sortBy(forest, plucker('freq'));
    var first = sorted[0];
    var second = sorted[1];

    return [{chr: null, 
             freq: first.freq + second.freq,
             left: first,
             right: second}].concat(_.rest(_.rest(sorted)));
};

/*
 * Takes a Huffman forest and returns the Huffman tree
 */
function huffmanTree(forest) {
    return _.size(forest) == 1 ? 
        forest[0] : 
        huffmanTree(combineLowest(forest));
};

/*
 * Determines if a tree node is a leaf
 */
function isLeaf(node) {
    return existy(node.chr); 
};

function norm(side, x) {
    return _.isArray(x) ?  
        _.map(x, partial(construct, side)) :  
        [[side, x]];
};

function traverse(node) {
    return isLeaf(node) ? 
        node.chr : 
        norm(0, traverse(node.left))
            .concat(norm(1, traverse(node.right)));
};

function toLookup(node) {
    return _.reduce(traverse(node), function(lookup, v) {
        lookup[_.last(v)] = butLast(v).join('');
        return lookup;
    }, {});
};

/*
 * Takes a Huffman tree and a string to compress
 * using the tree.  (It doesn't really matter
 * what is returned from this but it should be 
 * something that is easily to verify if the 
 * encode worked correctly like, [1,0,1,1,1,0],
 * or ["1001", "1", "1", "002"].  The latter is 
 * just each symbol with the path it's correcsponding
 * leaf node in the huffman tree.
 *
 */
function encode(tree, text) {
    var table = toLookup(tree);

    return _.map(text, function(x) {
        return table[x];
    });
};

/*
 * Takes the text to be compressed and returns
 * an array where the first item is the texts
 * corresponding Huffman tree and the second
 * item is the encoded text
 */
function huffman(text) {
    var freqs = calcFreqs(text);
    var tree = huffmanTree(toForest(freqs));

    return [tree, encode(tree, text)];
};

/*
 * An example of a Huffman tree visualization generator
 * that can be passed to visTree
 */
function visTreeHtml(n) {
    if (isLeaf(n)) {
        return ['<br/>chr = [', n.chr, '], freq = ', n.freq];
    }

    return ['<ul><li>freq = ', n.freq, '</li><li>left', 
           visTreeHtml(n.left), '</li><li>right',
           visTreeHtml(n.right), '</li></ul>'];
};

/* 
 * Displays a visualization of a Huffman tree in the browswer
 */
function visTree(tree, visGenerator) {
    document.body.innerHTML = _.flatten(visGenerator(tree)).join('');
};


var result = huffman("I want to ride my bicycle, I want to ride my bike");
visTree(result[0], visTreeHtml);
console.log(result);

