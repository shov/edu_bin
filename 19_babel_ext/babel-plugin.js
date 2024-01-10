export default function({types: t}) {
  return {
    visitor: {
      BinaryExpression(path) {
        if (path.node.operator !== "+") {
          return;
        }

        // check if left expression is identifier 
        
        console.log('left', path.node.left.type)
       

      }
    }
  };
}