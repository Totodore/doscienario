use std::collections::HashMap;

#[tauri::command]
pub fn autopos_blueprint(blueprint: Blueprint, level: i64) {
    let root = blueprint.root();
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct Blueprint {
    rels: HashMap<u64, Relationship>,
    nodes: HashMap<u64, Node>,
    margin: i64,
}

impl Blueprint {
    fn root(&self) -> &Node {
        self.nodes.values().find(|n| n.is_root).unwrap()
    }
    fn depth(&self) -> u32 {
        self.nodes.values().reduce(|a, b| if a.level > b.level { a } else { b }).unwrap().level
    }
    fn find_parent(&self, node: &Node) -> Option<&Node> {}
    fn find_child_rels(&self, node: &Node) -> impl Iterator<Item = &Relationship> {
        self.rels.values().filter(|rel| rel.parent_id == node.id)
    }
    fn find_child_nodes(&self, node: &Node) -> impl Iterator<Item = &Node> {
        self.find_child_rels(&node)
            .map(|rel| &self.nodes[&rel.child_id])
    }
    // fn find_parent_rels(&self, node: &Node) -> impl Iterator<Item = &Relationship> {
    // 	self.rels.values().filter(|&rel| rel.child_id == node.id)
    // }
    // fn find_parent_nodes(&self, node: &Node) -> impl Iterator<Item = &Node> {
    // 	self.find_parent_rels(&node).map(|rel| &self.nodes[&rel.parent_id])
    // }
    // fn find_nodes_by_level(&self, level: i64) -> impl Iterator<Item = &Node> {
    // }
}

#[derive(serde::Deserialize, serde::Serialize)]
struct Relationship {
    id: u64,
    is_root: bool,
    locked: bool,
    x: i64,
    y: i64,
    width: i64,
    height: i64,

    parent_id: u64,
    child_id: u64,
    parent_pole: Pole,
    child_pole: Pole,
}

#[derive(serde::Deserialize, serde::Serialize)]
struct Node {
    id: u64,
    x: i64,
    y: i64,
    is_root: bool,
    locked: bool,
    height: i64,
    width: i64,
    level: u32,
}

impl Relationship {
    fn get_origin(&self, node: &Node) -> Vector {
        return self.compute_position(&self.parent_pole, &node);
    }
    fn get_destination(&self, node: &Node) -> Vector {
        return self.compute_position(&self.child_pole, &node);
    }

    fn compute_position(&self, pole: &Pole, node: &Node) -> Vector {
        match pole {
            Pole::North => Vector(node.x + node.width / 2, node.y - node.height / 2),
            Pole::South => Vector(node.x + node.width / 2, node.y + node.height / 2),
            Pole::East => Vector(node.x + node.width, node.y),
            Pole::West => Vector(node.x, node.y),
        }
    }
}

#[derive(serde::Deserialize, serde::Serialize)]
enum Pole {
    North,
    South,
    East,
    West,
}

struct Vector(i64, i64);
