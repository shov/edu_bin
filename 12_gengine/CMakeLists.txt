cmake_minimum_required(VERSION 3.15)
project(gengine)

add_definitions(-DUNICODE)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

# add_executable(gengine WIN32
#     applicationclass.cpp
#     inputclass.cpp
#     main.cpp
#     systemclass.cpp
#     d3dclass.cpp
#     cameraclass.cpp
#     colorshaderclass.cpp
#     modelclass.cpp
# )
add_executable(gengine WIN32
    index.cpp
)

target_compile_options(gengine PRIVATE "/MT$<$<CONFIG:Debug>:d>")

target_link_libraries(gengine PRIVATE user32.lib)