package hw8;

import exceptions.InsertionException;
import exceptions.PositionException;
import exceptions.RemovalException;
import hw8.graph.Edge;
import hw8.graph.Graph;
import hw8.graph.Vertex;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public abstract class GraphTest {

  protected Graph<String, String> graph;
  private Graph<String, String> testGraph;

  @BeforeEach
  public void setupGraph() {
    this.graph = createGraph();
    this.testGraph = createGraph();
  }

  protected abstract Graph<String, String> createGraph();

  @Test
  @DisplayName("insert(v) returns a vertex with given data")
  public void canGetVertexAfterInsert() {
    Vertex<String> v1 = graph.insert("v1");
    assertEquals(v1.get(), "v1");
  }

  @Test
  @DisplayName("insert(v) throws insertion exception (v is null)")
  public void insertVertexThrowsInsertionExceptionWhenVertexNull() {
    try {
      graph.insert(null);
      fail("The expected exception was not thrown");
    } catch (InsertionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("insert(v) throws insertion exception (v already in graph)")
  public void insertVertexThrowsInsertionExceptionWhenVertexExists() {
    try {
      graph.insert("v");
      graph.insert("v");
      fail("The expected exception was not thrown");
    } catch (InsertionException ex) {
      return;
    }
  }


  @Test
  @DisplayName("insert(U, V, e) returns an edge with given data")
  public void canGetEdgeAfterInsert() {
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
    assertEquals(e1.get(), "v1-v2");
  }

  @Test
  @DisplayName("insert(null, V, e) throws position exception (either vertex is null)")
  public void insertEdgeThrowsPositionExceptionWhenVertexNull() {
    try {
      Vertex<String> v = graph.insert("v");
      graph.insert(null, v, "e");
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("insert(null, V, e) throws position exception (vertex from different graphs)")
  public void insertEdgeThrowsPositionExceptionWhenVertexFromDifferentGraphs() {
    try {
      Vertex<String> v1 = graph.insert("v");
      Vertex<String> v2 = testGraph.insert("v");
      graph.insert(v1, v2, "e");
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }


  @Test
  @DisplayName("insert(null, V, e) throws insertion exception (self-loop)")
  public void insertEdgeThrowsInsertionExceptionWhenSelfLoopFormed() {
    try {
      Vertex<String> v = graph.insert("v");
      graph.insert(v, v, "e");
      fail("The expected exception was not thrown");
    } catch (InsertionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("insert(null, V, e) throws insertion exception (duplicate edge)")
  public void insertEdgeThrowsInsertionExceptionWhenDuplicateEdge() {
    try {
      Vertex<String> v1 = graph.insert("v1");
      Vertex<String> v2 = graph.insert("v2");
      graph.insert(v1, v2, "v1-v2");
      graph.insert(v1, v2, "v2-v3");
      fail("The expected exception was not thrown");
    } catch (InsertionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("from(e) returns from vertex")
  public void canGetFromVertex() {
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
    Vertex<String> fromVertex = graph.from(e1);
    assertEquals(fromVertex, v1);
  }

  @Test
  @DisplayName("from(e) throws position exception (edge is null)")
  public void fromThrowsPositionExceptionWhenEdgeNull() {
    try {
      graph.from(null);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("from(e) throws position exception (vertex from different graphs)")
  public void fromThrowsPositionExceptionWhenVertexFromDifferentGraphs() {
    try {
      Vertex<String> v1 = graph.insert("v1");
      Vertex<String> v2 = graph.insert("v2");
      Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
      testGraph.insert("v");
      testGraph.from(e1);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("to(e) returns to vertex")
  public void canGetToVertex() {
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
    Vertex<String> toVertex = graph.to(e1);
    assertEquals(toVertex, v2);
  }

  @Test
  @DisplayName("to(e) throws position exception (edge is null)")
  public void toThrowsPositionExceptionWhenEdgeNull() {
    try {
      graph.to(null);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("to(e) throws position exception (vertex from different graphs)")
  public void toThrowsPositionExceptionWhenVertexFromDifferentGraphs() {
    try {
      Vertex<String> v1 = graph.insert("v1");
      Vertex<String> v2 = graph.insert("v2");
      Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
      testGraph.insert("v");
      testGraph.to(e1);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }


  @Test
  @DisplayName("remove(v) returns removed vertex element")
  public void canGetVertexElementAfterRemove() {
    Vertex<String> v1 = graph.insert("v1");
    String value = graph.remove(v1);
    assertEquals("v1", value);
  }


  @Test
  @DisplayName("remove(v) throws position exception (v is null)")
  public void removeThrowsPositionExceptionWhenVertexNull() {
    try {
      Vertex<String> v = null;
      graph.remove(v);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("remove(v) throws position exception (v not in graph)")
  public void removeThrowsPositionExceptionWhenVertexNotInGraph() {
    try {
      Vertex<String> v1 = graph.insert("v");
      Vertex<String> v2 = testGraph.insert("v");
      graph.remove(v2);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("remove(v) throws removal exception (has incident edges)")
  public void removeThrowsRemovalException() {
    try {
      Vertex<String> v1 = graph.insert("v1");
      Vertex<String> v2 = graph.insert("v2");
      Edge<String> e = graph.insert(v1, v2, "v1-v2");
      graph.remove(v1);
      fail("The expected exception was not thrown");
    } catch (RemovalException ex) {
      return;
    }
  }

  @Test
  @DisplayName("remove(e) returns removed edge element")
  public void canGetEdgeElementAfterRemove() {
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Edge<String> e = graph.insert(v1, v2, "v1-v2");
    String value = graph.remove(e);
    assertEquals("v1-v2", value);
  }

  @Test
  @DisplayName("remove(e) throws position exception (edge is null)")
  public void removeThrowsPositionExceptionWhenEdgeNull() {
    try {
      Edge<String> e = null;
      graph.remove(e);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("remove(e) throws position exception (e not in graph)")
  public void removeThrowsPositionExceptionWhenEdgeNotInGraph() {
    try {
      Vertex<String> v1 = testGraph.insert("v1");
      Vertex<String> v2 = testGraph.insert("v2");
      Edge<String> e = testGraph.insert(v1, v2, "v1-v2");
      graph.remove(e);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("label(v, l) labels a vertex (label(v) works)")
  public void canLabelVertex() {
    Vertex<String> v1 = graph.insert("v1");
    graph.label(v1, "Label v1");
    assertEquals("Label v1", graph.label(v1));
  }

  @Test
  @DisplayName("label(v, l) throws position exception (v is null)")
  public void labelVertexThrowsPositionExceptionWhenVertexNull() {
    try {
      Vertex<String> v1 = null;
      graph.label(v1, "Label v1");
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("label(e, l) labels an edge (label(e) works)")
  public void canLabelEdge() {
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Edge<String> e = graph.insert(v1, v2, "v1-v2");
    graph.label(e, "Label e1");
    assertEquals("Label e1", graph.label(e));
  }

  @Test
  @DisplayName("label(e, l) throws position exception (e is null)")
  public void labelEdgeThrowsPositionExceptionWhenEdgeNull() {
    try {
      Edge<String> e = null;
      graph.label(e, "Label e1");
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("clearLabels() clears all vertex and edge labels")
  public void canClearAllLabels() {
    Vertex<String> v1 = graph.insert("v1");
    graph.label(v1, "Head");
    Vertex<String> v2 = graph.insert("v2");
    graph.label(v2, "Leg1");
    Vertex<String> v3 = graph.insert("v3");
    graph.label(v3, "Leg3");
    Vertex<String> v4 = graph.insert("v4");
    graph.label(v4, "Leg4");
    Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
    graph.label(e1, "Small");
    Edge<String> e2 = graph.insert(v1, v3, "v1-v3");
    graph.label(e2, "Medium");
    Edge<String> e3 = graph.insert(v1, v4, "v1-v4");
    graph.label(e3, "Large");
    graph.clearLabels();

    assertNull(graph.label(v1));
    assertNull(graph.label(v2));
    assertNull(graph.label(v3));
    assertNull(graph.label(v4));
    assertNull(graph.label(e1));
    assertNull(graph.label(e2));
    assertNull(graph.label(e3));
  }

  @Test
  @DisplayName("vertices() iterates over all vertices")
  public void canIterateOverVertices() {
    int count = 0;
    String setter = "v";
    for (int i = 0; i < 7; i++) {
      graph.insert(setter);
      setter += "v";
    }
    Iterable<Vertex<String>> iterable = graph.vertices();
    for (Vertex<String> it: iterable) {
      if ("v".equals(it.get()) || "vv".equals(it.get()) || "vvv".equals(it.get()) || "vvvv".equals(it.get()) ||
              "vvvvv".equals(it.get()) || "vvvvvv".equals(it.get()) || "vvvvvvv".equals(it.get())) {
        // since a hashset doesn't iterate over objects in order, we must check for all equalities and increment count.
        count++;
      }
    }
    assertEquals(7, count);
  }


  @Test
  @DisplayName("edges() iterates over all vertices")
  public void canIterateOverEdges() {
    int count = 0;
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Vertex<String> v3 = graph.insert("v3");
    Vertex<String> v4 = graph.insert("v4");
    Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
    Edge<String> e2 = graph.insert(v1, v3, "v1-v3");
    Edge<String> e3 = graph.insert(v1, v4, "v1-v4");
    Edge<String> e4 = graph.insert(v2, v1, "v2-v1");
    Edge<String> e5 = graph.insert(v3, v1, "v3-v1");
    Edge<String> e6 = graph.insert(v4, v1, "v4-v1");


    Iterable<Edge<String>> iterable = graph.edges();
    for (Edge<String> it: iterable) {
      if ("v1-v2".equals(it.get()) || "v1-v3".equals(it.get()) || "v1-v4".equals(it.get()) ||
              "v2-v1".equals(it.get()) || "v3-v1".equals(it.get()) || "v4-v1".equals(it.get())) {
        // since a hashset doesn't iterate over objects in order, we must check for all equalities and increment count.
        count++;
      }
    }
    assertEquals(6, count);
  }


  @Test
  @DisplayName("outgoing(v) iterates over all outgoing edges")
  public void canIterateOverOutgoingEdges() {
    int count = 0;
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Vertex<String> v3 = graph.insert("v3");
    Vertex<String> v4 = graph.insert("v4");
    Vertex<String> v5 = graph.insert("v5");
    Vertex<String> v6 = graph.insert("v6");
    Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
    Edge<String> e2 = graph.insert(v1, v3, "v1-v3");
    Edge<String> e3 = graph.insert(v1, v4, "v1-v4");
    Edge<String> e4 = graph.insert(v1, v5, "v1-v5");
    Edge<String> e5 = graph.insert(v1, v6, "v1-v6");
    Edge<String> e6 = graph.insert(v2, v1, "v2-v1");
    Edge<String> e7 = graph.insert(v3, v1, "v3-v1");
    Edge<String> e8 = graph.insert(v4, v1, "v4-v1");
    Edge<String> e9 = graph.insert(v5, v1, "v5-v1");
    // v1 has 5 outgoing and 4 incoming edges


    Iterable<Edge<String>> iterable = graph.outgoing(v1);
    for (Edge<String> it: iterable) {
      if ("v1-v2".equals(it.get()) || "v1-v3".equals(it.get()) || "v1-v4".equals(it.get()) ||
              "v1-v5".equals(it.get()) || "v1-v6".equals(it.get()) || "v2-v1".equals(it.get())
              || "v3-v1".equals(it.get()) || "v4-v1".equals(it.get()) || "v5-v1".equals(it.get())) {
      // iterates over outgoing edges (and ignores incoming edges).
        count++;
      }
    }
    assertEquals(5, count);
  }


  @Test
  @DisplayName("incoming(v) iterates over all incoming edges")
  public void canIterateOverIncomingEdges() {
    int count = 0;
    Vertex<String> v1 = graph.insert("v1");
    Vertex<String> v2 = graph.insert("v2");
    Vertex<String> v3 = graph.insert("v3");
    Vertex<String> v4 = graph.insert("v4");
    Vertex<String> v5 = graph.insert("v5");
    Vertex<String> v6 = graph.insert("v6");
    Edge<String> e1 = graph.insert(v1, v2, "v1-v2");
    Edge<String> e2 = graph.insert(v1, v3, "v1-v3");
    Edge<String> e3 = graph.insert(v1, v4, "v1-v4");
    Edge<String> e4 = graph.insert(v1, v5, "v1-v5");
    Edge<String> e5 = graph.insert(v1, v6, "v1-v6");
    Edge<String> e6 = graph.insert(v2, v1, "v2-v1");
    Edge<String> e7 = graph.insert(v3, v1, "v3-v1");
    Edge<String> e8 = graph.insert(v4, v1, "v4-v1");
    Edge<String> e9 = graph.insert(v5, v1, "v5-v1");
    // v1 has 5 outgoing and 4 incoming edges


    Iterable<Edge<String>> iterable = graph.incoming(v1);
    for (Edge<String> it: iterable) {
      if ("v1-v2".equals(it.get()) || "v1-v3".equals(it.get()) || "v1-v4".equals(it.get()) ||
              "v1-v5".equals(it.get()) || "v1-v6".equals(it.get()) || "v2-v1".equals(it.get())
              || "v3-v1".equals(it.get()) || "v4-v1".equals(it.get()) || "v5-v1".equals(it.get())) {
        // iterates over incoming edges (and ignores outgoing edges).
        count++;
      }
    }
    assertEquals(4, count);
  }

  @Test
  @DisplayName("outgoing(v) throws position exception (v not in graph)")
  public void outgoingThrowsPositionExceptionWhenVertexNotInGraph() {
    try {
      Vertex<String> v = testGraph.insert("v");
      Iterable<Edge<String>> iterable = graph.outgoing(v);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }

  @Test
  @DisplayName("incoming(v) throws position exception (v not in graph)")
  public void incomingThrowsPositionExceptionWhenVertexNotInGraph() {
    try {
      Vertex<String> v = testGraph.insert("v");
      Iterable<Edge<String>> iterable = graph.incoming(v);
      fail("The expected exception was not thrown");
    } catch (PositionException ex) {
      return;
    }
  }










}
