cmake_minimum_required(VERSION 3.15)
project(glfw_test)

# Set the path to the directory containing the GLFW binaries
set(GLFW_DIR ${CMAKE_SOURCE_DIR}/dependencies)
include_directories(${GLFW_DIR}/include)

# add_definitions(-DUNICODE)
add_executable(glfw_test main.cpp)

# Link against the GLFW library
target_link_libraries(glfw_test PRIVATE ${GLFW_DIR}/lib-vc2019/glfw3.lib)
