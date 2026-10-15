---
title: "heheboobes/nebula-engine"
owner: "heheboobes"
name: "nebula-engine"
fullName: "heheboobes/nebula-engine"
description: "Nebula Engine - 2D game engine built on C++ and SFML"
sourceUrl: "https://github.com/heheboobes/nebula-engine"
stars: 8
forks: 0
language: "C++"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-25T03:40:46Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Nebula Engine

*图片：Build Status*
*图片：Version*
*图片：License*
*图片：C++*
*图片：Platform*
*图片：Tests*

A high-performance 2D game engine built on C++ and SFML, designed for rapid prototyping and production-grade game development.

## Features
- Entity Component System (ECS) architecture
- Hardware-accelerated 2D rendering pipeline
- Built-in physics engine with collision detection
- Spatial audio system
- Scene management with transitions
- Live editor and debugging tools
- Cross-platform (Windows, Linux, macOS)
- Post-processing effects pipeline
- Particle system
- 2D lighting system
- Networking (TCP/UDP)

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Windows 10, Ubuntu 20.04, macOS 11 | Windows 11, Ubuntu 22.04, macOS 13 |
| CPU | Intel i5 / AMD Ryzen 3 | Intel i7 / AMD Ryzen 5 |
| RAM | 4 GB | 8 GB |
| GPU | OpenGL 3.3 support | OpenGL 4.5 support |
| Disk | 500 MB | 2 GB |

## Dependencies

- C++17 compatible compiler (GCC 9+, Clang 12+, MSVC 2019+)
- CMake 3.14+
- SFML 2.6+
- OpenGL 3.3+
- OpenAL (audio)

## Building

```bash
# Clone the repository
git clone https://github.com/heheboobes/nebula-engine.git
cd nebula-engine

# Configure
cmake -B build -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build build --config Release

# Run tests
ctest --test-dir build
```

### Build Options

| Option | Default | Description |
|--------|---------|-------------|
| `NEBULA_BUILD_TESTS` | ON | Build unit tests |
| `NEBULA_BUILD_EXAMPLES` | ON | Build example projects |
| `NEBULA_BUILD_EDITOR` | ON | Build the editor |
| `NEBULA_ENABLE_PROFILING` | OFF | Enable built-in profiler |

## Quick Start

```cpp
#include 
using namespace nebula;

class MyGame : public Application {
public:
    MyGame() : Application("My Game", 1280, 720) {}

    void onInit() override {
        auto player = ecs::World::createEntity();
        ecs::World::addComponent(player, "hero.png");
        ecs::World::addComponent(player, {640, 360});
    }

    void onUpdate(float dt) override {
        auto& t = ecs::World::getComponent(player);
        if (Input::isKeyHeld(Key::Right)) t.position.x += 300 * dt;
        if (Input::isKeyHeld(Key::Left))  t.position.x -= 300 * dt;
    }

    void onRender() override {
        Renderer::begin(camera);
        Renderer::drawSprites();
        Renderer::end();
    }

    ecs::Entity player;
    gfx::Camera camera;
};

int main() {
    MyGame game;
    game.run();
}
```

## Downloads

| Platform | Link |
|----------|------|
| Windows | nebula-engine-v0.7.0-win64.zip |
| Linux | nebula-engine-v0.7.0-linux.tar.gz |
| macOS | nebula-engine-v0.7.0-macos.tar.gz |

## Documentation

- API Overview
- Getting Started
- ECS Tutorial
- Graphics Guide
- Physics Guide
- Audio Guide
- UI Guide
- Scene Guide
- Networking Guide
- Editor Guide
- Performance Guide
- Best Practices
- Examples
- Changelog

## Acknowledgments

- [SFML](https://www.sfml-dev.org/) - Multimedia library
- Dear ImGui - Editor UI framework
- Tracy Profiler - Performance profiling
- nlohmann/json - JSON serialization
- All contributors and community members

## License

MIT License
