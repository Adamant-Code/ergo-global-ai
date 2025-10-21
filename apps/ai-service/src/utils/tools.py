import inspect
from pydantic import create_model

# generates tools schema json automatically 
def tool(name, description):
    def decorator(func):
        # defining our model inheriting from pydantic.BaseModel and define fields as annotated attributes
        input_model = create_model(
            func.__name__ + "_input",
            **{
                name: (param.annotation, param.default)
                for name, param in inspect.signature(func).parameters.items()
                if param.default is not inspect.Parameter.empty
            },
        )

        # bedrock tool schema
        func.bedrock_schema = {
            'toolSpec': {
                'name': name,
                'description': description,
                'inputSchema': {
                    'json': input_model.schema()
                }
            }
        }
        return func

    return decorator