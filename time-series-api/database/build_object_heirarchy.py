from schemas import *
import importlib

def load_class_from_package(package_name, module_name, class_name): 
    try: 
        # Import the module from the package 
        module = importlib.import_module(f"{package_name}.{module_name}") 
        #Get the class from the module 
        cls = getattr(module, class_name) 
        return cls 
    except (ImportError, AttributeError) as e: 
        print(f"Error: {e}") 
        return None


def build_object_heirarchy(db_object, base_object, inheritance_chain):
    obj_heirarchy=[]
    
    parent=db_object #inialize with main object to start chain
    for item in inheritance_chain:
        model=getattr(parent, item)
        name = getattr(model,  "name", model.__table__.name)#fetch name if exists

        #encode db object to pydantic
        schema = load_class_from_package(package_name="schemas",module_name=item+"_schema",class_name=item.capitalize() +"_Base")
        encoded_model=schema.model_validate(model)

        obj_heirarchy.append({ "type": item, "object":encoded_model, "id": model.id, "name":name })
        parent=model #model becomes the parent for the next iteration

    obj_heirarchy.reverse()#reverses order so first element is the farthest parent
    
    name = getattr(db_object,  "name", db_object.__table__.name)#fetch name if exists
    obj_heirarchy.append({ "type": db_object.__table__.name, "object":base_object, "id": db_object.id, "name": name }) #add in main object
    return obj_heirarchy