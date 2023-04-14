using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class UIHandler : MonoBehaviour
{
    TheStarController star;
    public TextMeshProUGUI countCaption;
    public Button startButton;
    public Button restartButton;

    public TextMeshProUGUI score;
    public TextMeshProUGUI levelCaption;

    void Start()
    {
        star = GetComponent<TheStarController>();
        star.ui = this;
    }

    private void Update()
    {
        if (countCaption is not null)
        {
            countCaption.text = star.numVertices.ToString();
        }
    }

    public void RestartGame()
    {
        star.RestartGame();
    }

    public void AdjustVerticesNumber(float verticesCountFactor)
    {
        // MAX 30 // MIN 3
        star.numVertices = 3 + (int)System.Math.Round(verticesCountFactor * (30 - 3));
        star.RenderPoly();
    }
}
