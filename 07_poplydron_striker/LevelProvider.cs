using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Level
{
    public float starSpeed;
    public float strikerSpeed;

    public float[] ruleArr;
}
public class LevelProvider
{
    public static int MAX_LEVEL = 8;
    private Level[] levelArr;
    
    public LevelProvider()
    {
        levelArr = new Level[MAX_LEVEL];

        // 1 Triangle
        {
            Level lvl = new Level();
            lvl.starSpeed = 25f; //      ignored as for firs lvl, but 
            lvl.strikerSpeed = -100f; //   used after restart
            lvl.ruleArr = new float[] {
                1f, 0f,
                1f, 120f,
                1f, 240f
                };
            levelArr[0] = lvl;
        }
        // 2 Quad
        {
            Level lvl = new Level();
            lvl.starSpeed = 35f;
            lvl.strikerSpeed = -140f;
            lvl.ruleArr = new float[] {
                1f, 0f,
                1f, 90f,
                1f, 180f,
                1f, 270f
                };
            levelArr[1] = lvl;
        }
        // 3 Pentagon
        {
            Level lvl = new Level();
            lvl.starSpeed = 40f;
            lvl.strikerSpeed = -115f;
            lvl.ruleArr = new float[] {
                1f, 0f,
                1f, 360f / 5 * 1,
                1f, 360f / 5 * 2,
                1f, 360f / 5 * 3,
                1f, 360f / 5 * 4,
                };
            levelArr[2] = lvl;
        }
        // 4 Hexagon X-form
        {
            Level lvl = new Level();
            lvl.starSpeed = 50f;
            lvl.strikerSpeed = -120f;
            lvl.ruleArr = new float[] {
                1f, 0f,
                0.5f, 360f / 8 * 1,
                1f,  360f / 8 * 2,
                1f,  360f / 8 * 2 + 360f / 4 * 1,
                0.5f, 360f / 8 * 3 + 360f / 4 * 1,
                1f, 360f / 8 * 4 + 360f / 4 * 1,
            };
            levelArr[3] = lvl;
        }
        // 5 Heptagon
        {
            Level lvl = new Level();
            lvl.starSpeed = 55f;
            lvl.strikerSpeed = -125f;
            lvl.ruleArr = new float[] {
                1f, 0f,
                1f, 360f / 7 * 1,
                1f, 360f / 7 * 2,
                1f, 360f / 7 * 3,
                1f, 360f / 7 * 4,
                1f, 360f / 7 * 5,
                1f, 360f / 7 * 6,
            };
            levelArr[4] = lvl;
        }
        // 6 Star-4
        {
            Level lvl = new Level();
            lvl.starSpeed = 60f;
            lvl.strikerSpeed = -130f;
            lvl.ruleArr = new float[] {
                1f, 0f,
                0.5f, 360f / 8 * 1,
                1f, 360f / 8 * 2,
                0.5f, 360f / 8 * 3,
                1f, 360f / 8 * 4,
                0.5f, 360f / 8 * 5,
                1f, 360f / 8 * 6,
                0.5f, 360f / 8 * 7,
            };
            levelArr[5] = lvl;
        }
        // 7 Slanting-Star-1
        {
            Level lvl = new Level();
            lvl.starSpeed = 65f;
            lvl.strikerSpeed = -135f;
            lvl.ruleArr = new float[] {
               1f, 0f,
               0.9f, 360f / 16 * 1,
               0.7f, 360f / 16 * 1 + 360f / 8 * 1,
               1f, 360f / 16 * 2 + 360f / 8 * 1,
               0.5f, 360f / 16 * 2 + 360f / 8 * 2,
               1f, 360f / 16 * 2 + 360f / 8 * 3,
               0.9f, 360f / 16 * 3 + 360f / 8 * 3,
               0.7f, 360f / 16 * 3 + 360f / 8 * 4,
               1f, 360f / 16 * 4 + 360f / 8 * 4,
               0.5f, 360f / 16 * 4 + 360f / 8 * 5
            };
            levelArr[6] = lvl;
        }
        // 8 Star-5
        {
            Level lvl = new Level();
            lvl.starSpeed = 70f;
            lvl.strikerSpeed = -140f;
            lvl.ruleArr = new float[] {
                1f, 0f,
                0.5f, 360f / 10 * 1,
                1f, 360f / 10 * 2,
                0.5f, 360f / 10 * 3,
                1f, 360f / 10 * 4,
                0.5f, 360f / 10 * 5,
                1f, 360f / 10 * 6,
                0.5f, 360f / 10 * 7,
                1f, 360f / 10 * 8,
                0.5f, 360f / 10 * 9,
            };
            levelArr[7] = lvl;
        }
    }

    public Level GetLevel(int num)
    {
        return levelArr[num % MAX_LEVEL];
    }
}
