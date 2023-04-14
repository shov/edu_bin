using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

[RequireComponent(typeof(MeshFilter))]
public class MeshGenerator : MonoBehaviour
{
    // Vertices and links
    Mesh mesh;
    Vector3[] vertices;
    int[] triangles;
    public int numVertices = 3;

    // Movement
    public float rotateSpeed = 25f;
    public float zOffset = -0.2f;
    public bool isRotationGoes = false;

    // Target
    public GameObject targetPrefab;
    public int goalsAchieved = 0;

    // Start is called before the first frame update
    void Start()
    {
        mesh = new Mesh();
        GetComponent<MeshFilter>().mesh = mesh;
        RenderPoly();
    }

    void CreateShape()
    {
        // vertices
        vertices = new Vector3[numVertices + 2];
        vertices[0] = new Vector3(0, 0, -1); // top vertex
        vertices[numVertices + 1] = new Vector3(0, 0, 1); // bottom vertex
        float angle = 0f;
        float angleIncrement = 360f / (float)numVertices;
        // if == 6 and even num of vertices and around 50% chance to get a Star / if its > 6 its always Star, so num if Vrtices must be even
        if (numVertices > 6 && 0 != numVertices % 2) numVertices++;
        bool isStar = numVertices > 6 || (numVertices > 5 && Random.Range(0f, 1f) > 0.5f);
        for (int i = 0; i < numVertices; i++)
        {
            angle += angleIncrement;
            float radius = isStar && i % 2 == 0 ? 0.5f : 1f; // if star, even vertices to be shorter
            float x = radius * Mathf.Sin(angle * Mathf.Deg2Rad);
            float y = radius * Mathf.Cos(angle * Mathf.Deg2Rad);
            float z = zOffset;
            vertices[i + 1] = new Vector3(x, y, z);
        }

        // Targets
        Transform[] targetArr = transform.GetComponentsInChildren<Transform>().Where(t => t.tag == "Target").ToArray();
        foreach(Transform t in targetArr)
        {
            Destroy(t.gameObject);
        }

        for (int i = 1; i <= numVertices; i++)
        {
           PlaceATarget(vertices[i], vertices[(numVertices == i) ? 1 : i + 1]);
        }

        // triangles
        triangles = new int[numVertices * 6];

        for (int i = 0; i < numVertices; i++)
        {
            int j = i * 6;
            triangles[j] = 0; // top
            triangles[j + 1] = i + 1; // current
            triangles[j + 2] = i == numVertices - 1 ? 1 : i + 2; // next (given simetry)

            triangles[j + 3] = triangles[j + 2];
            triangles[j + 4] = triangles[j + 1];
            triangles[j + 5] = numVertices + 1;
        }

    }

    void UpdateMesh()
    {
        mesh.Clear();
        mesh.vertices = vertices;
        mesh.triangles = triangles;
        mesh.RecalculateBounds();
        mesh.RecalculateNormals();
        mesh.RecalculateTangents();
    }

    void PlaceATarget(Vector3 a, Vector3 b)
    {
        Vector3 center = new Vector3(a.x + b.x, a.y + b.y) / 2;
        center.z = zOffset;

        GameObject target = Instantiate(targetPrefab, center, Quaternion.identity, transform);
        target.transform.LookAt(b, Vector3.forward);
        target.transform.localScale = new Vector3(0.2f, 0.2f, Vector3.Distance(a, b));

        Transform innerOk = target.transform.Find("ok");
        innerOk.localScale = new Vector3(0.1f, 0.1f,1f);
        innerOk.localPosition += new Vector3(0.16f, 0.55f, 0);
    }

    // Update is called once per frame
    void Update()
    {
        if (isRotationGoes)
        {
            transform.Rotate(0, 0, rotateSpeed * Time.deltaTime);
        }

        if(goalsAchieved == numVertices)
        {
            goalsAchieved = 0;
            numVertices++;
            RenderPoly();
        }
    }

    public void RenderPoly()
    {
        isRotationGoes = false;
        transform.rotation = Quaternion.identity;
        CreateShape();
        UpdateMesh();
        isRotationGoes = true;
    }

    void OnDrawGizmos()
    {
        if (vertices == null) return;

        foreach (Vector3 x in vertices)
        {
            if (null == x) continue;
            Gizmos.DrawSphere(x, 0.1f);
        }
    }
}
