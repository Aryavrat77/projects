package hw8.spp;

import hw8.graph.Edge;
import hw8.graph.Graph;
import hw8.graph.Vertex;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.PriorityQueue;


public class DijkstraStreetSearcher extends StreetSearcher {

  /**
   * Creates a StreetSearcher object.
   *
   * @param graph an implementation of Graph ADT.
   */

  public DijkstraStreetSearcher(Graph<String, String> graph) {
    super(graph);
  }

  @Override
  public void findShortestPath(String startName, String endName) {

    HashSet<Vertex<String>> isExplored = new HashSet<>();
    PriorityQueue<VertexNode> queue = new PriorityQueue<>();
    HashMap<Vertex<String>, Double> distanceMap = new HashMap<>();

    Vertex<String> start = vertices.get(startName);
    Vertex<String> end = vertices.get(endName);

    VertexNode startNode = new VertexNode(start);
    startNode.distance = 0.0;
    VertexNode endNode = new VertexNode(end);
    queue.add(startNode);
    VertexNode unexploredVertexNode = startNode;
    Vertex<String> unexploredVertex = start;

    double totalDist = findShortestPathHelper(queue, isExplored, distanceMap, unexploredVertex, unexploredVertexNode);

    // These method calls will create and print the path for you
    checkValidEndpoint(startName);
    checkValidEndpoint(endName);

    List<Edge<String>> path = getPath(end, start);
    if (VERBOSE) {
      printPath(path, totalDist);
    }
  }

  private double findShortestPathHelper(PriorityQueue<VertexNode> queue, HashSet<Vertex<String>> isExplored,
                                        HashMap<Vertex<String>, Double> distanceMap, Vertex<String> unexploredVertex,
                                        VertexNode unexploredVertexNode) {
    while (!queue.isEmpty()) {
      Double dist;
      unexploredVertexNode = queue.poll();
      unexploredVertex = unexploredVertexNode.vertex;
      isExplored.add(unexploredVertex);

      Iterable<Edge<String>> outgoingEdgeList = graph.outgoing(unexploredVertex);
      for (Edge<String> outgoingEdge : outgoingEdgeList) {
        dist = unexploredVertexNode.distance + (Double) graph.label(outgoingEdge);
        Vertex<String> neighboringVertex = graph.to(outgoingEdge);
        VertexNode neighboringVertexNode = new VertexNode(neighboringVertex);
        if (!isExplored.contains(neighboringVertex)) {
          queue.add(neighboringVertexNode);
        }
        updateDistance(neighboringVertex, neighboringVertexNode, dist, distanceMap);
      }
    }
    return unexploredVertexNode.distance;
  }

  private void updateDistance(Vertex<String> neighboringVertex, VertexNode neighboringVertexNode,
                              Double dist, HashMap<Vertex<String>, Double> distanceMap) {

    if (dist < neighboringVertexNode.distance) {
      neighboringVertexNode.distance = dist;
      if (!distanceMap.containsKey(neighboringVertex)) {
        distanceMap.put(neighboringVertex, dist);
      } else {
        distanceMap.remove(neighboringVertex);
        distanceMap.put(neighboringVertex, dist);
      }
    }
  }

  private class VertexNode implements Comparable {

    Vertex<String> vertex;
    Double distance;

    VertexNode(Vertex<String> v) {
      this.vertex = v;
      this.distance = Double.POSITIVE_INFINITY;
    }

    @Override
    public int compareTo(Object otherDist) {
      return (int) (this.distance - (Double)otherDist);
    }

  }
}
