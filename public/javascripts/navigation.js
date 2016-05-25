/**
 * Created by hayun on 2016. 5. 8..
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'qwer1234',
    database: 'jariyo'
});

function Graph(){
    this.isWeighted=false;
    this.nodes=[];
    this.addNode=addNode;
    this.removeNode=removeNode;
    this.nodeExist=nodeExist;
    this.getAllNodes=getAllNodes;
    this.findNode=findNode;

    function addNode(Name, Loc_x, Loc_y, Exit, Entrance){
        var temp = new Node(Name, Loc_x, Loc_y, Exit, Entrance);
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

function Node(Name, Loc_x, Loc_y, Exit, Entrance){
    this.name=Name;
    this.loc_x=Loc_x;
    this.loc_y=Loc_y;
    this.exit=Exit;
    this.entrance=Entrance;
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

// source_id로부터 모든 node에 대하여 distance와 previousNode를 구한다
function dijkstra(graph,source_id){

    this.previousNode=[];
    this.distance=new Array();
    this.shortestPath=[];
    var source = graph.findNode(source_id);
    this.distance[source.name]=0;
    var pq=new MinPQ();
    var S = new MinPQ();
    this.nodes=graph.getAllNodes();
    this.length=this.nodes.length;
    for(var i=0;i<this.length;i++){
        if(this.nodes[i]!=source){
            this.distance[this.nodes[i].name]=Number.POSITIVE_INFINITY;
        }
        pq.push(this.nodes[i],this.distance[this.nodes[i].name]);
    }

    // source node로부터 가장 가까운 경로들을 구함
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



}

function path_opt_0(graph, source_id){
    var path = new dijkstra(graph, source_id);
    var S = new MinPQ();
    this.shortestPath=[];

    // 거리가 가장 가까운 것
    for(var i=0; i<path.length; i++){
        S.push(path.nodes[i], path.distance[path.nodes[i].name]);
    }
    console.log(path.previousNode);
    //console.log(graph.findNode(path.previousNode[u.name]));

    // 가장 거리가 가까운 것부터 꺼내면서 빈자리가 있는 노드를 찾아냄
    S.pop();
    var u = S.pop();
    //console.log(u);
    while(u==source_id || (graph.findNode(path.previousNode[u.name]).findEmptySpace(u.name)) == 0){
        u = S.pop();
    }

    // destination node로부터 source node까지 경로를 shortestPath에 푸쉬함
    var tmp = u.name;
    while (tmp != source_id){
        this.shortestPath.push(tmp);
        tmp = path.previousNode[tmp];
    }
    this.shortestPath.push(tmp);

    // 순서가 역순으로 되어 있으므로 reverse
    this.shortestPath.reverse();
    //console.log(this.shortestPath);
}

function path_opt_1(graph, source_id) {
    var rev_graph = new Graph();
    var path = new dijkstra(graph, source_id);
    var R = new MinPQ();
    var S = new MinPQ();
    this.shortestPath=[];
    var exit_node_id;

    // 역방향 그래프에 노드 추가
    for (var i=0; i<graph.nodes.length; i++){
        rev_graph.addNode(graph.nodes[i].name, graph.nodes[i].loc_x, graph.nodes[i].loc_y, graph.nodes[i].exit_node, graph.nodes[i].entrance_node);
        if (graph.nodes[i].exit == 1)
            exit_node_id = graph.nodes[i].name;
    }

    // 역방향 그래프에 엣지 추가
    for (var i=0; i<graph.nodes.length; i++){
        for (var j=0; j<graph.nodes[i].adjList.length; j++){
            //console.log(rev_graph.findNode(graph.nodes[i].adjList[j]));
            //console.log(graph.nodes[i].name);
            //console.log(graph.nodes[i].distance[j]);
            rev_graph.findNode(graph.nodes[i].adjList[j]).addEdge(graph.nodes[i].name, graph.nodes[i].weight[j], graph.nodes[i].emptySpace[j]);
        }
    }

    var rev_path = new dijkstra(rev_graph, exit_node_id);


    // 거리가 가장 가까운 것
    for(var i=0; i<rev_path.length; i++){
        R.push(rev_path.nodes[i], rev_path.distance[rev_path.nodes[i].name]);
    }
    console.log(rev_path.previousNode);
    //console.log(graph.findNode(path.previousNode[u.name]));

    // 가장 거리가 가까운 것부터 꺼내면서 빈자리가 있는 노드를 찾아냄
    R.pop();
    var u = R.pop();
    console.log(u);
    while(u==source_id || (graph.findNode(rev_path.previousNode[u.name]).findEmptySpace(u.name)) == 0){
        u = R.pop();
    }

    // 목적지 먼저 추가
    this.shortestPath.push(rev_path.previousNode[u.name]);

    // destination node로부터 soruce node까지 경로를 shortestPath에 푸쉬함
    var tmp = u.name;
    while (tmp != source_id){
        this.shortestPath.push(tmp);
        tmp = path.previousNode[tmp];
    }
    this.shortestPath.push(tmp);

    // 순서가 역순으로 되어 있으므로 reverse
    this.shortestPath.reverse();
    //console.log(this.shortestPath);
}

function path_opt_2(graph, source_id){
    var path = new dijkstra(graph, source_id);
    var S = new MinPQ();
    this.shortestPath=[];
    var entrance_node_id=[];
    var edgePQ = new MinPQ();
    var flag;   // 0이면 가장가까운 노드 찾기
                // 1이면 입구 노드 근처
    var finish;

    // 입구 노드 리스트 생성
    for (var i=0; i<path.length; i++) {
        if (graph.nodes[i].entrance == 1){
            entrance_node_id.push(graph.nodes[i].name);
        }
    }

    // 입구 노드를 포함한 엣지 MinPQ 생성
    for (var i=0; i<path.length; i++){
        for (var j=0; j<graph.nodes[i].emptySpace.length; j++){
            var u = graph.nodes[i];
            if (u.entrance == 1){
                if (u.emptySpace[j] != 0) {
                    edgePQ.push([u.name, u.adjList[j]], path.distance[u.name] + u.weight[j]);
                }
            }
            else {
                var v = graph.findNode(u.adjList[j]);
                if (v.entrance == 1){
                    if (u.emptySpace[j] != 0){
                        edgePQ.push([u.name, v.name], path.distance[u.name] + u.weight[j]);
                    }
                }
            }
        }
    }

    // 가장 거리가 가까운 것부터 꺼내면서 빈자리가 있는 노드를 찾아냄
    var e = edgePQ.pop();

    var uu;
    if (e === undefined) {
        // 가장 거리가 가까운 것부터 꺼내면서 빈자리가 있는 노드를 찾아냄
        S.pop();
        uu = S.pop();
        console.log(u);
        while(uu==source_id || (graph.findNode(path.previousNode[uu.name]).findEmptySpace(uu.name)) == 0){
            uu = S.pop();
        }
    }
    else {
        uu = graph.findNode(e[0]);
        this.shortestPath.push(e[1]);
    }

    // destination node로부터 source node까지 경로를 shortestPath에 푸쉬함
    var tmp = uu.name;
    while (tmp != source_id){
        this.shortestPath.push(tmp);
        tmp = path.previousNode[tmp];
    }
    this.shortestPath.push(tmp);

    // 순서가 역순으로 되어 있으므로 reverse
    this.shortestPath.reverse();
    //console.log(this.shortestPath);
}

function path_opt_3(graph, source_id){
    var path = new dijkstra(graph, source_id);
    var S = new MinPQ();
    this.shortestPath=[];
    var e;
    var maxSpace = 0;

    // 빈자리가 가장 많은 엣지 찾기
    for (var i=0; i<graph.nodes.length; i++) {
        for (var j = 0; j < graph.nodes[i].adjList.length; j++) {
            if (graph.nodes[i].weight[j] > maxSpace) {
                maxSpace = graph.nodes[i].weight[j];
                e = [graph.nodes[i].name, graph.nodes[i].adjList[j]];
            }
        }
    }

    this.shortestPath.push(e[1]);

    // destination node로부터 source node까지 경로를 shortestPath에 푸쉬함
    var tmp = e[0];
    console.log(e);
    while (tmp != source_id){
        this.shortestPath.push(tmp);
        tmp = path.previousNode[tmp];
    }
    this.shortestPath.push(tmp);

    // 순서가 역순으로 되어 있으므로 reverse
    this.shortestPath.reverse();
    //console.log(this.shortestPath);
}


exports.findPath = function(data, callback)
{
    connection.connect(function(err) {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
            throw err;
        }
    });

    var graph = new Graph();

    connection.query("USE jariyo;", function(err) {
        if(err) throw err;
    });


    connection.query("SELECT * FROM Node;", function(err, rows, cols) {
        if(err) throw err;
        for (var i=0; i<rows.length; i++) {
            graph.addNode(rows[i].node_id, rows[i].node_loc_x, rows[i].node_loc_y, rows[i].exit_node, rows[i].entrance_node);
        }
    });


    connection.query("SELECT * FROM Edge;", function(err, rows, cols) {
        if(err) throw err;
        for (var i=0; i<rows.length; i++) {
            var head_node = graph.findNode(rows[i].head_node_id);
            var tail_node = graph.findNode(rows[i].tail_node_id);
            head_node.addEdge(tail_node.name, rows[i].distance, rows[i].total_empty_space)
        }
        //console.log(graph);
        console.log('# source node id = ' + data.node_id);
        console.log('  option = ' + data.option);
        var dijk;
        if (data.option == 0){
            dijk = new path_opt_0(graph, data.node_id);
        }
        else if (data.option == 1){
            dijk = new path_opt_1(graph, data.node_id);
        }
        else if (data.option == 2){
            dijk = new path_opt_2(graph, data.node_id);
        }
        else {
            dijk = new path_opt_3(graph, data.node_id);
        }

        callback(dijk.shortestPath);
    });

    connection.end();
}


exports.findPath({node_id: 3, option: 2}, function(path) {
    console.log(path);
});