import os
import time

class CodeHookHandler:
    def __init__(self):
        pass
    
    def extract_code_content(self, message):
        """Extract code content from the AI message"""
        # Check for trigger phrases
        triggers = ["Hello CodeHook", "Hey CodeHook"]
        trigger_used = None
        
        for trigger in triggers:
            if message.startswith(trigger):
                trigger_used = trigger
                break
        
        if not trigger_used:
            return None
        
        # Extract everything after the trigger
        code_content = message[len(trigger_used):].strip()
        return code_content
    
    def write_to_codespace(self, code_content, file_path):
        """Write the code directly to a file in the Codespace"""
        try:
            # Create directory if it doesn't exist
            dir_path = os.path.dirname(file_path)
            if dir_path:
                os.makedirs(dir_path, exist_ok=True)
            
            # Write the content to the file
            with open(file_path, "w") as f:
                f.write(code_content)
            
            return {"status": "success", "file_path": file_path}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def determine_location(self, content, preferred_filename=None):
        """Determine appropriate location and filename based on content"""
        content_lower = content.lower()
        
        # Determine file extension
        if "def " in content_lower or "import " in content_lower or "class " in content_lower:
            ext = "py"
            default_dir = "backend"
        elif "function" in content_lower or "const " in content_lower or "let " in content_lower:
            ext = "js"
            default_dir = "frontend"
        elif "<html" in content_lower or "<div" in content_lower:
            ext = "html"
            default_dir = "frontend"
        elif "@app" in content_lower and "def" in content_lower:
            ext = "py"
            default_dir = "backend"
        else:
            ext = "txt"
            default_dir = ""
        
        # Determine filename
        if preferred_filename:
            # Use the provided filename
            if "." in preferred_filename:
                file_name = preferred_filename
            else:
                file_name = f"{preferred_filename}.{ext}"
        else:
            # Generate a timestamped filename
            timestamp = int(time.time())
            file_name = f"generated_{timestamp}.{ext}"
        
        # Create the complete file path
        if default_dir:
            file_path = os.path.join(default_dir, file_name)
        else:
            file_path = file_name
        
        return file_path
    
    def process_ai_message(self, message, preferred_filename=None, preferred_path=None):
        """Process an AI message, extract code, and save to Codespace"""
        # Extract the code content
        code_content = self.extract_code_content(message)
        
        if not code_content:
            return {"status": "ignored", "message": "No CodeHook trigger found"}
        
        # Determine where to save the file
        if preferred_path:
            file_path = preferred_path
        else:
            file_path = self.determine_location(code_content, preferred_filename)
        
        # Write to the Codespace
        result = self.write_to_codespace(code_content, file_path)
        result["file_name"] = os.path.basename(file_path)
        
        return result