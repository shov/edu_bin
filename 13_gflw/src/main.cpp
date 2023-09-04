#include <iostream>
#include <fstream>
#include <string>
#include <GL/glew.h>
#include <GLFW/glfw3.h>

#define ASSERT(x) do {if (!(x)) __debugbreak();} while (0)
#define GL_CALL(x) x; ASSERT(GLErrorHandler(#x, __FILE__, __LINE__))

static bool GLErrorHandler(const char* function, const char* file, int line)
{
    bool noErrors = true;
    GLenum error = glGetError();
    while (error != GL_NO_ERROR)
    {
        std::cout
            << file << ":" << line << " " << function << std::endl 
            << "\tOpenGL error: " << error << std::endl;
        noErrors = false;
        error = glGetError();
    }
    return noErrors;
}

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
    unsigned int id = GL_CALL(glCreateShader(type));
    const char *src = source.c_str();
    GL_CALL(glShaderSource(id, 1, &src, nullptr));
    GL_CALL(glCompileShader(id));

    int result;
    GL_CALL(glGetShaderiv(id, GL_COMPILE_STATUS, &result));
    if (GL_FALSE == result)
    {
        int length;
        GL_CALL(glGetShaderiv(id, GL_INFO_LOG_LENGTH, &length));
        char *message = (char *)(alloca(length * sizeof(char)));
        GL_CALL(glGetShaderInfoLog(id, length, &length, message));
        std::cout << "Failed to compile " << (type == GL_VERTEX_SHADER ? "vertex" : "fragment") << " shader!"
                  << std::endl;
        std::cout << message << std::endl;
        GL_CALL(glDeleteShader(id));
        return 0;
    }
    return id;
}

static int CreateShader(const std::string &vertexShader, const std::string &fragmentShader)
{
    unsigned int program = GL_CALL(glCreateProgram());
    unsigned int vs = CompileShader(GL_VERTEX_SHADER, vertexShader);
    unsigned int fs = CompileShader(GL_FRAGMENT_SHADER, fragmentShader);

    GL_CALL(glAttachShader(program, vs));
    GL_CALL(glAttachShader(program, fs));
    GL_CALL(glLinkProgram(program));
    GL_CALL(glValidateProgram(program));

    GL_CALL(glDeleteShader(vs));
    GL_CALL(glDeleteShader(fs));

    return program;
}

int main(void)
{
    GLFWwindow *window;

    // Init glfw
    if (!glfwInit())
        return -1;

        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // Create windowed mode window and its OpenGL context
    window = glfwCreateWindow(640, 480, "TIK TAK", NULL, NULL);
    if (!window)
    {
        glfwTerminate();
        return -1;
    }

    // Make the window's context current
    glfwMakeContextCurrent(window);

    glfwSwapInterval(1);

    // Init glew. must be after glfwMakeContextCurrent
    if (glewInit() != GLEW_OK)
    {
        std::cout << "Error!" << std::endl;
    }
    else
    {
        std::cout << "GLEW INIT OK " << glGetString(GL_VERSION) << std::endl;
    }

    float positions[] = {
        -0.5f, -1.0f,
        0.0f, 0.5f,
        0.0f, 0.0f,
        -0.5f, 0.5f};

    unsigned int indices[] = {
        0, 1, 2,
        0, 3, 1};


    unsigned int vao;
    GL_CALL(glGenVertexArrays(1, &vao));
    GL_CALL(glBindVertexArray(vao));

    unsigned int posBuffer;
    GL_CALL(glGenBuffers(1, &posBuffer));
    GL_CALL(glBindBuffer(GL_ARRAY_BUFFER, posBuffer));
    GL_CALL(glBufferData(GL_ARRAY_BUFFER, 2 * 4 * sizeof(float), positions, GL_DYNAMIC_DRAW));

    GL_CALL(glEnableVertexAttribArray(0));
    GL_CALL(glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 2, 0));

    unsigned int ibo;
    GL_CALL(glGenBuffers(1, &ibo));
    GL_CALL(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ibo));
    GL_CALL(glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(unsigned int) * 6, indices, GL_DYNAMIC_DRAW));

    // Shaders
    std::string vertexShader = LoadShaderFromFile("../shaders/vertex.glsl");
    std::string fragmentShader = LoadShaderFromFile("../shaders/fragment.glsl");

    unsigned int shader = CreateShader(vertexShader, fragmentShader);
    GL_CALL(glUseProgram(shader));

    GL_CALL(int location = glGetUniformLocation(shader, "u_Color"));
    ASSERT(-1 != location);
    
    // Check if program been validated successfully
    {
        int result;
        GL_CALL(glGetProgramiv(shader, GL_VALIDATE_STATUS, &result));
        if (GL_FALSE == result)
        {
            int length;
            GL_CALL(glGetProgramiv(shader, GL_INFO_LOG_LENGTH, &length));
            char *message = (char *)(alloca(length * sizeof(char)));
            GL_CALL(glGetProgramInfoLog(shader, length, &length, message));
            std::cout << "Failed to validate program!" << std::endl;
            std::cout << message << std::endl;
        }
        else
        {
            std::cout << "Program validated successfully!" << std::endl;
        }
    }

    

    float r = 0.0f;
    float increment = 0.01f;
    // Game loop
    while (!glfwWindowShouldClose(window))
    {
        // Render
        GL_CALL(glClear(GL_COLOR_BUFFER_BIT));

        GL_CALL(glUniform4f(location, r, 0.5f, 0.5f, 1.0f));

        // Draw a triangle
        GL_CALL(glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, nullptr));

        if (r > 1.0f)
        {
            increment = -0.01f;
        }
        else if (r < 0.0f)
        {
            increment = 0.01f;
        }
        r += increment;


        // Swap buffers
        GL_CALL(glfwSwapBuffers(window));

        // Poll events
        GL_CALL(glfwPollEvents());
    }

    GL_CALL(glDeleteProgram(shader));

    glfwTerminate();
    return 0;
}