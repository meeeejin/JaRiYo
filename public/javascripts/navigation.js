/**
 * Created by hayun on 2016. 5. 8..
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'qwer1234',
    multipleStatements: true
});

connection.connect();

function Graph(){
    this.isWeighted=false;
    this.nodes=[];
    this.addNode=addNode;
    this.removeNode=removeNode;
    this.nodeExist=nodeExist;
    this.getAllNodes=getAllNodes;
    this.findNode=findNode;

    function addNode(Name){
        var temp = new Node(Name);
        this.nodes.push(temp);
        return temp;
    }

    function removeNode(Name){

        var index=this.nodes.indexOf(Name);
        if(index>-1){
            this.nodes.splice(index,1);
            var len=this.nodes.length;

            for (var i = 0; i < len; i++) {
                if(this.nodes[i].adjList.indexOf(Name)>-1){
                    this.nodes[i].adjList.slice(this.nodes[i].adjList.indexOf(Name));
                    this.nodes[i].weight.slice(this.nodes[i].adjList.indexOf(Name));
                }
            }
        }
    }

    function nodeExist(Name){
        var index=this.nodes.indexOf(Name);
        if(index>-1){
            return true;
        }
        return false;
    }

    function getAllNodes(){
        return this.nodes;
    }

    function findNode(Name){
        var len = this.nodes.length;
        for (var i = 0; i < len; i++) {
            if(this.nodes[i].name == Name) {
                return this.nodes[i];
            }
        }
    }

}

function Node(Name){
    this.name=Name;
    this.adjList=[];
    this.weight=[];
    this.emptySpace=[];
    this.addEdge=addEdge;
    this.compare=compare;
    this.findEmptySpace=findEmptySpace;
    function addEdge(neighbour,weight,emptySpace){
        this.adjList.push(neighbour);
        this.weight.push(weight);
        this.emptySpace.push(emptySpace);
    }

    function getAdjList(){
        return adjList;
    }
    function compare(node2){
        return this.weight-node2.weight;
    }

    function findEmptySpace(Name) {
        var len = this.adjList.length;
        for (var i = 0; i < len; i++) {
            if (this.adjList[i]== Name) {
                return this.emptySpace[i];
            }
        }
    }


}

function binaryHeap(){
    this.nodes=[];
}

binaryHeap.prototype.size=function(){
    return this.nodes.length;
};

binaryHeap.prototype.compare = function(node1,node2) {
    return node1.priority-node2.priority;
};
binaryHeap.prototype.insert_push = function(element) {
    this.nodes.push(element);
    this.bubbleUp(this.nodes.length-1);
};

binaryHeap.prototype.remove_pop = function() {
    var ans=this.nodes[0];
    var last_element=this.nodes.pop();

    if(this.nodes.length> 0){
        this.nodes[0]=last_element;
        this.sinkDown(0);
    }
    return ans;
};

binaryHeap.prototype.delete_node = function(node) {
    var length=this.nodes.length;
    isPresent=false;
    for (var i = 0; i < length; i++) {
        if((this.nodes[i].content!=node)) continue;
        var end=this.nodes.pop();
        if(i==length-1) break;
        this.nodes[i]=end;
        this.bubbleUp(i);
        this.sinkDown(i);
        isPresent=true;
        break;
    }
    return isPresent;
};

binaryHeap.prototype.top = function() {
    return this.nodes[0];
};

binaryHeap.prototype.sinkDown = function(i) {
    var length=this.nodes.length;
    while(true && i<length){
        var flag=0;
        if(2*i+1 < length && this.compare(this.nodes[i],this.nodes[2*i+1])>0){
            if(2*i+2< length && this.compare(this.nodes[2*i+1],this.nodes[2*i+2])>0){
                flag=2;
            }else{
                flag=1;
            }
        }else if( 2*i+2 < length && this.compare(this.nodes[i],this.nodes[2*i+2])>0){
            flag=2;
        }else {
            break;
        }
        var temp=this.nodes[2*i+flag];
        this.nodes[2*i+flag]=this.nodes[i];
        this.nodes[i]=temp;
        i=2*i+flag;
    }
};


binaryHeap.prototype.bubbleUp = function(i) {

    var length=this.nodes.length;
    while(i>0){
        var index=Math.floor((i+1)/2)-1;
        //console.log(this.compare(this.nodes[i],this.nodes[index]));
        if(this.compare(this.nodes[i],this.nodes[index])<0){
            //console.log(this.nodes[i].priority+' '+this.nodes[index].priority);
            var temp=this.nodes[index];
            this.nodes[index]=this.nodes[i];
            this.nodes[i]=temp;
            i=index;
        }else {
            break;
        }

    }
};

function MinPQ(list){

    bh=new binaryHeap();
    this.heap=bh;
}

MinPQ.prototype.push=function(node,priority){
    var temp=new MinPQNodes(node,priority);
    this.heap.insert_push(temp);
};

MinPQ.prototype.pop=function(){
    return this.heap.remove_pop().content;
};


MinPQ.prototype.remove=function(node){
    return this.heap.delete_node(node);
};

MinPQ.prototype.top=function(){
    return this.heap.top().content;
};
MinPQ.prototype.size=function(){
    return this.heap.size();
};

function MinPQNodes(content,priority){
    this.content=content;
    this.priority=priority;
}

function dijkstra(graph,source_id){

    this.previousNode=[];
    this.distance=new Array();
    this.shortestPath=[];
    var source = graph.findNode(source_id);
    this.distance[source.name]=0;
    this.emptySpace;
    var pq=new MinPQ();
    var S = new MinPQ();
    var nodes=graph.getAllNodes();
    var length=nodes.length;
    for(var i=0;i<length;i++){
        if(nodes[i]!=source){
            this.distance[nodes[i].name]=Number.POSITIVE_INFINITY;
        }
        pq.push(nodes[i],this.distance[nodes[i].name]);
    }

    while(pq.size()!=0){
        var u=pq.pop();
        S.push(u,this.distance[u.name]);
        var adjList=u.adjList;
        for (var i = 0; i < adjList.length; i++) {
            var v=graph.findNode(adjList[i]);
            if(this.distance[u.name]!=Number.POSITIVE_INFINITY){
                var alt=this.distance[u.name]+u.weight[i];
                if(alt<this.distance[v.name]){
                    this.distance[v.name]=alt;
                    this.previousNode[v.name]=u.name;
                    pq.remove(v);
                    pq.push(v,this.distance[v.name]);
                }
            }
        }
    }

    var u = S.pop();
    while(u==source || (this.emptySpace=graph.findNode(this.previousNode[u.name]).findEmptySpace(u.name)) == 0){
        u = S.pop();
    }

    var tmp = u.name;
    while (tmp != source_id){
        this.shortestPath.push(tmp);
        tmp = this.previousNode[tmp];
    }
    this.shortestPath.push(tmp);
    this.shortestPath.reverse();

}


var graph = new Graph();
//var nodes = [];

connection.query("USE jariyo;", function(err) {
    if(err) throw err;
});


// 쿼리 만들 때 내가 속한 주차장과 층수도 받아와야 할 듯 하다!! -> 그거에 대한 조인도 필요할 듯
connection.query("SELECT node_id FROM Node;", function(err, rows, cols) {
    if(err) throw err;
    for (var i=0; i<rows.length; i++) {
        graph.addNode(rows[i].node_id);
    }
});


connection.query("SELECT * FROM Edge;", function(err, rows, cols) {
    if(err) throw err;
    for (var i=0; i<rows.length; i++) {
        var head_node = graph.findNode(rows[i].head_node_id);
        var tail_node = graph.findNode(rows[i].tail_node_id);
        head_node.addEdge(tail_node.name, rows[i].distance, rows[i].total_empty_space)
    }
    var source = 1;
    console.log('# source node id = ' + source)
    var dijk = new dijkstra(graph, source);;
    console.log();
    console.log('# Shortest Path');
    console.log(dijk.shortestPath);
    console.log();
    console.log('# Empty Space');
    console.log(dijk.emptySpace);
});


connection.end();