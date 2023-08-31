#include <iostream>
#include <fstream>
#include <string>
#include <GL/glew.h>
#include <GLFW/glfw3.h>

// load shader from file function
static std::string LoadShaderFromFile(const std::string &filepath)
{
    std::ifstream stream(filepath);
    std::string line;
    std::string shader;

    // read file line by line
    while (getline(stream, line))
    {
        shader += line + "\n";
    }

    return shader;
}

static unsigned int CompileShader(unsigned int type, const std::string &source)
{
    unsigned int id = glCreateShader(type);
    const char *src = source.c_str();
    glShaderSource(id, 1, &src, nullptr);
    glCompileShader(id);

    int result;
    glGetShaderiv(id, GL_COMPILE_STATUS, &result);
    if (GL_FALSE == result)
    {
        int length;
        glGetShaderiv(id, GL_INFO_LOG_LENGTH, &length);
        char *message = (char *)(alloca(length * sizeof(char)));
        glGetShaderInfoLog(id, length, &length, message);
        std::cout << "Failed to compile " << (type == GL_VERTEX_SHADER ? "vertex" : "fragment") << " shader!"
                  << std::endl;
        std::cout << message << std::endl;
        glDeleteShader(id);
        return 0;
    }
    return id;
}

static int CreateShader(const std::string &vertexShader, const std::string &fragmentShader)
{
    unsigned int program = glCreateProgram();
    unsigned int vs = CompileShader(GL_VERTEX_SHADER, vertexShader);
    unsigned int fs = CompileShader(GL_FRAGMENT_SHADER, fragmentShader);

    glAttachShader(program, vs);
    glAttachShader(program, fs);
    glLinkProgram(program);
    glValidateProgram(program);

    glDeleteShader(vs);
    glDeleteShader(fs);

    return program;
}

int main(void)
{
    GLFWwindow *window;

    // Init glfw
    if (!glfwInit())
        return -1;

    // Create windowed mode window and its OpenGL context
    window = glfwCreateWindow(640, 480, "Hello World", NULL, NULL);
    if (!window)
    {
        glfwTerminate();
        return -1;
    }

    // Make the window's context current
    glfwMakeContextCurrent(window);

    // Init glew. must be after glfwMakeContextCurrent
    if (glewInit() != GLEW_OK)
    {
        std::cout << "Error!" << std::endl;
    }
    else
    {
        std::cout << "GLEW INIT OK " << glGetString(GL_VERSION) << std::endl;
    }

    unsigned int buffer;
    glGenBuffers(1, &buffer);
    glBindBuffer(GL_ARRAY_BUFFER, buffer);

    float positions[6] = {
        -0.5f, -0.5f, // 0
        0.0f, 0.5f,   // 1
        0.5f, -0.5f   // 2
    };

    glBufferData(GL_ARRAY_BUFFER, sizeof(float) * 6, positions, GL_DYNAMIC_DRAW);
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 2, 0);
    glEnableVertexAttribArray(0);

    // Shaders
    std::string vertexShader = LoadShaderFromFile("../shaders/vertex.glsl");
    std::string fragmentShader = LoadShaderFromFile("../shaders/fragment.glsl");  

    unsigned int shader = CreateShader(vertexShader, fragmentShader);
    glUseProgram(shader);

    // Game loop
    while (!glfwWindowShouldClose(window))
    {
        // Render
        glClear(GL_COLOR_BUFFER_BIT);

        // Draw a triangle
        glDrawArrays(GL_TRIANGLES, 0, 3);

        // Swap buffers
        glfwSwapBuffers(window);

        // Poll events
        glfwPollEvents();
    }

    glfwTerminate();
    return 0;
}