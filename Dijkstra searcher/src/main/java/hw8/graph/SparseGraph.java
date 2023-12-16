package hw8.graph;

import exceptions.InsertionException;
import exceptions.PositionException;
import exceptions.RemovalException;
import java.util.Collections;
import java.util.HashSet;


/**
 * An implementation of Graph ADT using incidence lists
 * for sparse graphs where most nodes aren't connected.
 *
 * @param <V> Vertex element type.
 * @param <E> Edge element type.
 */
public class SparseGraph<V, E> implements Graph<V, E> {

  HashSet<V> vertexElementList;
  HashSet<Edge<E>> edgeList;
  HashSet<Vertex<V>> vertexList;

  /**
   * Create an empty graph.
   */
  public SparseGraph() {
    vertexList = new HashSet<>();
    edgeList = new HashSet<>();
    vertexElementList = new HashSet<>();
  }

  // Converts the vertex back to a VertexNode to use internally
  private VertexNode<V> convert(Vertex<V> v) throws PositionException {
    try {
      VertexNode<V> gv = (VertexNode<V>) v;
      if (gv.owner != this) {
        throw new PositionException();
      }
      return gv;
    } catch (NullPointerException | ClassCastException ex) {
      throw new PositionException();
    }
  }

  // Converts and edge back to a EdgeNode to use internally
  private EdgeNode<E> convert(Edge<E> e) throws PositionException {
    try {
      EdgeNode<E> ge = (EdgeNode<E>) e;
      if (ge.owner != this) {
        throw new PositionException();
      }
      return ge;
    } catch (NullPointerException | ClassCastException ex) {
      throw new PositionException();
    }
  }

  @Override
  public Vertex<V> insert(V v) throws InsertionException {
    if (v == null || vertexElementList.contains(v)) {
      throw new InsertionException();
    }
    VertexNode<V> v1 = new VertexNode<>(v);
    v1.owner = this;
    vertexElementList.add(v);
    vertexList.add(v1);
    return v1;
  }

  @Override
  public Edge<E> insert(Vertex<V> from, Vertex<V> to, E e)
      throws PositionException, InsertionException {
    if (from == null || to == null || !vertexList.contains(from) || !vertexList.contains(to)) {
      throw new PositionException();
    }
    VertexNode<V> fromVertex = convert(from);
    VertexNode<V> toVertex = convert(to);
    if (fromVertex.data == toVertex.data || fromVertex.outgoingVertexList.contains(toVertex)
            || toVertex.incomingVertexList.contains(fromVertex)) {
      // insertion exception when self-loop or duplicate edge
      throw new InsertionException();
    }
    EdgeNode<E> e1 = new EdgeNode<>(fromVertex, toVertex, e);
    e1.owner = this;
    edgeList.add(e1);
    fromVertex.outgoingVertexList.add(toVertex);
    toVertex.incomingVertexList.add(fromVertex);
    fromVertex.outgoingEdgeList.add(e1);
    toVertex.incomingEdgeList.add(e1);
    return e1;
  }

  @Override
  public V remove(Vertex<V> v) throws PositionException, RemovalException {
    if (v == null || !vertexList.contains(v)) {
      throw new PositionException();
    }
    VertexNode<V> vertexToRemove = convert(v);
    if (!vertexToRemove.outgoingEdgeList.isEmpty() || !vertexToRemove.incomingEdgeList.isEmpty()) {
      throw new RemovalException();
    }
    V value = vertexToRemove.data;
    vertexList.remove(vertexToRemove);
    vertexElementList.remove(value);
    return value;
  }

  @Override
  public E remove(Edge<E> e) throws PositionException {
    if (e == null || !edgeList.contains(e)) {
      throw new PositionException();
    }
    EdgeNode<E> edgeToRemove = convert(e);
    VertexNode<V> fromVertex = edgeToRemove.from;
    VertexNode<V> toVertex = edgeToRemove.to;
    edgeList.remove(edgeToRemove);
    fromVertex.outgoingVertexList.remove(toVertex);
    toVertex.incomingVertexList.remove(fromVertex);
    fromVertex.outgoingEdgeList.remove(edgeToRemove);
    toVertex.incomingEdgeList.remove(edgeToRemove);
    return edgeToRemove.data;
  }

  @Override
  public Iterable<Vertex<V>> vertices() {
    return Collections.unmodifiableCollection(vertexList);
  }

  @Override
  public Iterable<Edge<E>> edges() {
    return Collections.unmodifiableCollection(edgeList);
  }

  @Override
  public Iterable<Edge<E>> outgoing(Vertex<V> v) throws PositionException {
    VertexNode<V> v1 = convert(v);
    return v1.outgoingEdgeList;
  }

  @Override
  public Iterable<Edge<E>> incoming(Vertex<V> v) throws PositionException {
    VertexNode<V> v1 = convert(v);
    return v1.incomingEdgeList;
  }

  @Override
  public Vertex<V> from(Edge<E> e) throws PositionException {
    if (e == null) {
      throw new PositionException();
    }
    EdgeNode<E> edge = convert(e);
    return edge.from;
  }

  @Override
  public Vertex<V> to(Edge<E> e) throws PositionException {
    if (e == null) {
      throw new PositionException();
    }
    EdgeNode<E> edge = convert(e);
    return edge.to;
  }

  @Override
  public void label(Vertex<V> v, Object l) throws PositionException {
    if (v == null) {
      throw new PositionException();
    }
    VertexNode<V> vertex = convert(v);
    vertex.label = l;
  }

  @Override
  public void label(Edge<E> e, Object l) throws PositionException {
    if (e == null) {
      throw new PositionException();
    }
    EdgeNode<E> edge = convert(e);
    edge.label = l;
  }

  @Override
  public Object label(Vertex<V> v) throws PositionException {
    if (v == null) {
      throw new PositionException();
    }
    VertexNode<V> vertex = convert(v);
    return vertex.label;
  }

  @Override
  public Object label(Edge<E> e) throws PositionException {
    if (e == null) {
      throw new PositionException();
    }
    EdgeNode<E> edge = convert(e);
    return edge.label;
  }

  @Override
  public void clearLabels() {
    for (Edge<E> e: edgeList) {
      EdgeNode<E> edge = convert(e);
      edge.label = null;
    }

    for (Vertex<V> v: vertexList) {
      VertexNode<V> vertex = convert(v);
      vertex.label = null;
    }

  }

  @Override
  public String toString() {
    GraphPrinter<V, E> gp = new GraphPrinter<>(this);
    return gp.toString();
  }

  // Class for a vertex of type V
  private final class VertexNode<V> implements Vertex<V> {
    V data;
    Graph<V, E> owner;
    Object label;

    HashSet<Edge<E>> outgoingEdgeList;
    HashSet<Edge<E>> incomingEdgeList;
    HashSet<Vertex<V>> outgoingVertexList;
    HashSet<Vertex<V>> incomingVertexList;

    VertexNode(V v) {
      this.data = v;
      this.label = null;
      outgoingEdgeList = new HashSet<>();
      incomingEdgeList = new HashSet<>();
      outgoingVertexList = new HashSet<>();
      incomingVertexList = new HashSet<>();

    }

    @Override
    public V get() {
      return this.data;
    }
  }

  //Class for an edge of type E
  private final class EdgeNode<E> implements Edge<E> {
    E data;
    Graph<V, E> owner;
    VertexNode<V> from;
    VertexNode<V> to;
    Object label;
    // TODO You may need to add fields/methods here!

    // Constructor for a new edge
    EdgeNode(VertexNode<V> f, VertexNode<V> t, E e) {
      this.from = f;
      this.to = t;
      this.data = e;
      this.label = null;
    }

    @Override
    public E get() {
      return this.data;
    }
  }

}
