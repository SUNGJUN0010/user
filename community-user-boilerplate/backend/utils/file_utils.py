import os
from flask import current_app

def delete_avatar_file(avatar_url):
    """
    아바타 파일을 안전하게 삭제하는 함수
    
    Args:
        avatar_url (str): 삭제할 아바타 파일의 URL 경로
        
    Returns:
        bool: 삭제 성공 여부
    """
    if not avatar_url:
        return True
        
    try:
        # URL에서 파일 경로 추출
        file_path = avatar_url.lstrip('/')
        full_path = os.path.join(current_app.root_path, '..', file_path)
        
        # 파일이 존재하고 avatars 디렉토리 내에 있는지 확인
        if (os.path.exists(full_path) and 
            'avatars' in full_path and 
            os.path.isfile(full_path)):
            
            os.remove(full_path)
            print(f"DEBUG: 아바타 파일 삭제 완료: {full_path}")
            return True
        else:
            print(f"DEBUG: 아바타 파일이 존재하지 않거나 유효하지 않음: {full_path}")
            return False
            
    except Exception as e:
        print(f"DEBUG: 아바타 파일 삭제 실패: {e}")
        return False
