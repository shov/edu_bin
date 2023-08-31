cmake_minimum_required(VERSION 3.15)
project(glfw_test)

set(GLFW_DIR ${CMAKE_SOURCE_DIR}/dependencies/GLFW-3)
set(GLEW_DIR ${CMAKE_SOURCE_DIR}/dependencies/GLEW-2.1.0)
find_package(OpenGL REQUIRED)

include_directories(${GLFW_DIR}/include)
include_directories(${GLEW_DIR}/include)

add_definitions(-DGLEW_STATIC)

# add_definitions(-DUNICODE)
add_executable(glfw_test src/main.cpp)

# Link against the GLFW library
target_link_libraries(glfw_test PRIVATE 
    ${GLEW_DIR}/lib/glew32s.lib
    ${GLFW_DIR}/lib-vc2019/glfw3.lib
    ${OPENGL_LIBRARIES}
)

#message("OpenGL Libraries: ${OPENGL_LIBRARIES}") 
#>> OpenGL Libraries: opengl32;glu32
