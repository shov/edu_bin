cmake_minimum_required(VERSION 3.15)
project(gengine)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

add_executable(gengine WIN32
    applicationclass.cpp
    inputclass.cpp
    main.cpp
    systemclass.cpp
    d3dclass.cpp
)

target_link_libraries(gengine PRIVATE user32.lib)