
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NODES 2000
#define MAX_EDGES 20000
#define INF 1000000000

typedef struct
{
    int to;
    int next;
    int capacity;
} Edge;

static Edge edges[2 * MAX_EDGES];
static int head[MAX_NODES];
static int edge_count = 0;

static int parent_node[MAX_NODES];
static int parent_edge[MAX_NODES];
static int queue_nodes[MAX_NODES];

static void add_edge(int u, int v, int capacity)
{
    edges[edge_count].to = v;
    edges[edge_count].capacity = capacity;
    edges[edge_count].next = head[u];
    head[u] = edge_count++;

    edges[edge_count].to = u;
    edges[edge_count].capacity = 0;
    edges[edge_count].next = head[v];
    head[v] = edge_count++;
}

static int bfs(int n, int source, int sink)
{
    int front = 0, rear = 0;

    for (int i = 0; i < n; i++)
    {
        parent_node[i] = -1;
        parent_edge[i] = -1;
    }

    queue_nodes[rear++] = source;
    parent_node[source] = source;

    while (front < rear)
    {
        int u = queue_nodes[front++];

        for (int e = head[u]; e != -1; e = edges[e].next)
        {
            int v = edges[e].to;

            if (parent_node[v] == -1 && edges[e].capacity > 0)
            {
                parent_node[v] = u;
                parent_edge[v] = e;

                if (v == sink)
                {
                    return 1;
                }

                queue_nodes[rear++] = v;
            }
        }
    }

    return 0;
}
static void find_min_cut(int n, int source)
{
    int reachable[MAX_NODES] = {0};
    int queue[MAX_NODES];
    int front = 0, rear = 0;
    int cut_capacity = 0;

    reachable[source] = 1;
    queue[rear++] = source;

    /* BFS through the final residual graph */
    while (front < rear)
    {
        int u = queue[front++];

        for (int e = head[u]; e != -1; e = edges[e].next)
        {
            int v = edges[e].to;

            if (!reachable[v] && edges[e].capacity > 0)
            {
                reachable[v] = 1;
                queue[rear++] = v;
            }
        }
    }

    printf("\nMinimum Cut Edges:\n");

    /* Every original forward edge has an even edge index */
    for (int e = 0; e < edge_count; e += 2)
    {
        int u = -1;
        int v = edges[e].to;

        /* Recover the original starting node */
        for (int node = 0; node < n; node++)
        {
            for (int k = head[node]; k != -1; k = edges[k].next)
            {
                if (k == e)
                {
                    u = node;
                    break;
                }
            }

            if (u != -1)
                break;
        }

        if (u != -1 &&
            reachable[u] &&
            !reachable[v])
        {
            int original_capacity =
                edges[e].capacity + edges[e ^ 1].capacity;

            if (original_capacity > 0)
            {
                printf("%d -> %d | Capacity: %d\n",
                       u, v, original_capacity);

                cut_capacity += original_capacity;
            }
        }
    }

    printf("Minimum Cut Capacity: %d\n", cut_capacity);

    printf("Source-side nodes:");
    for (int i = 0; i < n; i++)
    {
        if (reachable[i])
            printf(" %d", i);
    }

    printf("\nSink-side nodes:");
    for (int i = 0; i < n; i++)
    {
        if (!reachable[i])
            printf(" %d", i);
    }

    printf("\n");
}

static int edmonds_karp(int n, int source, int sink)
{
    int max_flow = 0;
    int iteration = 0;

    while (bfs(n, source, sink))
    {
        int bottleneck = INF;

        for (int v = sink; v != source; v = parent_node[v])
        {
            int e = parent_edge[v];

            if (edges[e].capacity < bottleneck)
            {
                bottleneck = edges[e].capacity;
            }
        }

        for (int v = sink; v != source; v = parent_node[v])
        {
            int e = parent_edge[v];

            edges[e].capacity -= bottleneck;
            edges[e ^ 1].capacity += bottleneck;
        }

        max_flow += bottleneck;
        iteration++;

        printf("Augmenting Path %d: ", iteration);

        int path[MAX_NODES];
        int path_length = 0;

        for (int v = sink; v != source; v = parent_node[v])
        {
            path[path_length++] = v;
        }

        printf("%d", source);

        for (int i = path_length - 1; i >= 0; i--)
        {
            printf(" -> %d", path[i]);
        }

        printf("\nBottleneck capacity: %d\n", bottleneck);
        printf("Total flow so far: %d\n\n", max_flow);
    }

    printf("No more augmenting paths exist.\n\n");
    printf("Maximum flow: %d\n", max_flow);

    return max_flow;
}

int main(void)
{
    int n, m, source, sink;

    /*
      Input format:
      n m source sink
      u v capacity
      u v capacity
      ...
    */

    if (scanf("%d %d %d %d", &n, &m, &source, &sink) != 4)
    {
        fprintf(stderr, "ERROR: Invalid graph input header.\n");
        return 1;
    }

    if (n < 2 || n > MAX_NODES ||
        m < 0 || m > MAX_EDGES ||
        source < 0 || source >= n ||
        sink < 0 || sink >= n ||
        source == sink)
    {
        fprintf(stderr, "ERROR: Invalid graph size or terminals.\n");
        return 1;
    }

    for (int i = 0; i < n; i++)
    {
        head[i] = -1;
    }

    edge_count = 0;

    for (int i = 0; i < m; i++)
    {
        int u, v, capacity;

        if (scanf("%d %d %d", &u, &v, &capacity) != 3)
        {
            fprintf(stderr, "ERROR: Invalid edge at row %d.\n", i + 1);
            return 1;
        }

        if (u < 0 || u >= n || v < 0 || v >= n ||
            u == v || capacity <= 0 ||
            capacity > INF / 2)
        {
            fprintf(stderr, "ERROR: Invalid edge values at row %d.\n", i + 1);
            return 1;
        }

        if (edge_count + 2 > 2 * MAX_EDGES)
        {
            fprintf(stderr, "ERROR: Too many edges.\n");
            return 1;
        }

        add_edge(u, v, capacity);
    }

    printf("NEXUS - DisasterFlow\n");
    printf("Nodes: %d\n", n);
    printf("Road connections: %d\n", m);
    printf("Source: %d\n", source);
    printf("Destination: %d\n\n", sink);

    edmonds_karp(n, source, sink);
    find_min_cut(n, source);

    return 0;
}
