using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

[RequireComponent(typeof(MeshFilter))]
public class TheStarController : MonoBehaviour
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
    public int failSteps = 0;
    public int score = 0;
    public int maxAchevedScore = 0;
    public int maxFailStepsAllowed = 3;
    public float failScaleFactor = 0.2f;

    // Levels
    int level = 0;
    Level currLevel;
    LevelProvider levelProvider = new LevelProvider();

    // Striker
    public Striker striker;

    // UI
    public UIHandler ui;

    // Animator
    private Animator animator;

    // Start is called before the first frame update
    void Start()
    {
        mesh = new Mesh();
        GetComponent<MeshFilter>().mesh = mesh;

        currLevel = levelProvider.GetLevel(0);
        numVertices = Mathf.RoundToInt((float)currLevel.ruleArr.Length / 2);

        RenderPoly();
        striker = GameObject.Find("Striker").GetComponent<Striker>();
        striker.gameObject.SetActive(false); // instant disable

        animator = GetComponent<Animator>();
    }

    // Update is called once per frame
    void Update()
    {
        if (isRotationGoes)
        {
            transform.Rotate(0, 0, rotateSpeed * Time.deltaTime);
        }

        // Win Level
        if (goalsAchieved == numVertices)
        {
            goalsAchieved = 0;

            level++;
            ui.levelCaption.text = "LVL " + (level + 1);
            currLevel = levelProvider.GetLevel(level);
            numVertices = Mathf.RoundToInt((float)currLevel.ruleArr.Length / 2);
            rotateSpeed = currLevel.starSpeed;
            striker.rotateSpeed = currLevel.strikerSpeed;

            striker.gameObject.SetActive(false);
            SwapStar();
        }

        // Fail
        if (failSteps == maxFailStepsAllowed)
        {
            transform.localScale = new Vector3(1f, 1f, 1f);
            failSteps = 0;
            numVertices = 3;
            goalsAchieved = 0;
            
            striker.gameObject.SetActive(false);

            level = 0;
            currLevel = levelProvider.GetLevel(0);
            numVertices = Mathf.RoundToInt((float)currLevel.ruleArr.Length / 2);
            rotateSpeed = currLevel.starSpeed;
            striker.rotateSpeed = currLevel.strikerSpeed;

            SwapStar();

            ui.levelCaption.text = "LVL " + (level + 1);
            ui.score.text = "" + maxAchevedScore;

            ui.restartButton.gameObject.SetActive(true);
        }
    }

    void CreateShape()
    {
        // Reset scaling
        transform.localScale = new Vector3(1f, 1f, 1f);

        // Vertices
        vertices = new Vector3[numVertices + 2];
        vertices[0] = new Vector3(0, 0, -1); // top vertex
        vertices[numVertices + 1] = new Vector3(0, 0, 1); // bottom vertex

        for (int i = 0; i < numVertices; i++)
        {
            float radius = currLevel.ruleArr[i * 2];
            float angle = currLevel.ruleArr[i * 2 + 1];
            float x = radius * Mathf.Sin(angle * Mathf.Deg2Rad);
            float y = radius * Mathf.Cos(angle * Mathf.Deg2Rad);
            float z = zOffset;
            vertices[i + 1] = new Vector3(x, y, z);
        }

        // Place targets

        for (int i = 1; i <= numVertices; i++)
        {
            PlaceATarget(vertices[i], vertices[(numVertices == i) ? 1 : i + 1]);
        }

        // Triangles
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

    public void RenderPoly()
    {
        isRotationGoes = false;
        transform.rotation = Quaternion.identity;
        CreateShape();
        UpdateMesh();
        isRotationGoes = true;
    }

    void SwapStar()
    {
        // Remove old targets
        Transform[] targetArr = transform.GetComponentsInChildren<Transform>().Where(t => t.tag == "Target").ToArray();
        foreach (Transform t in targetArr)
        {
            Destroy(t.gameObject);
        }

        animator.enabled = true;
        animator.SetTrigger("Swap"); // Calls RenderPoly() and OnSwapOver()
    }

    void OnSwapOver()
    {
        // Line up rotations, disable animator
        animator.gameObject.transform.rotation = Quaternion.identity;
        animator.enabled = false;

        // Restart button means it just has been failed
        if (!ui.restartButton.gameObject.activeInHierarchy)
        {
            striker.gameObject.SetActive(true);
        }
    }

    void PlaceATarget(Vector3 a, Vector3 b)
    {
        Vector3 center = new Vector3(a.x + b.x, a.y + b.y) / 2;
        center.z = zOffset;

        GameObject target = Instantiate(targetPrefab, center, Quaternion.identity, transform);
        target.transform.LookAt(b, Vector3.forward);
        target.transform.localScale = new Vector3(0.2f, 0.2f, Vector3.Distance(a, b));

        Transform innerOk = target.transform.Find("ok");
        innerOk.localScale = new Vector3(0.4f, 0.1f, 1f);
        innerOk.localPosition += new Vector3(-0.05f, 0.55f, 0);
        Transform innerFail = target.transform.Find("fail");
        innerFail.localScale = new Vector3(0.4f, 0.1f, 1f);
        innerFail.localPosition += new Vector3(-0.05f, 0.55f, 0);
    }

    public void IncreaseGoalachived()
    {
        goalsAchieved++;
        score++;
        maxAchevedScore = Mathf.Max(score, maxAchevedScore);
        ui.score.text = "" + score;
    }

    public void DecreaseGoalAchived()
    {
        goalsAchieved--;
        score--;
        ui.score.text = "" + score;
    }

    public void CallFail()
    {
        failSteps++;
        transform.localScale = new Vector3(1f - failScaleFactor * failSteps, 1f - failScaleFactor * failSteps, 1f - failScaleFactor * failSteps);
    }

    public void StartGame()
    {
        ui.startButton.gameObject.SetActive(false);
        striker.gameObject.SetActive(true);
    }

    public void RestartGame()
    {
        ui.score.text = "0";
        score = 0;
        ui.restartButton.gameObject.SetActive(false);
        striker.gameObject.SetActive(true);
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
