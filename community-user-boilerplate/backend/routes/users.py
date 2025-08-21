from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from PIL import Image
import uuid
from ..extensions import db
from ..models import User
from ..utils.file_utils import delete_avatar_file

bp = Blueprint("users", __name__, url_prefix="/api/users")


@bp.put("/me")
@jwt_required()
def update_me():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({"message": "인증 오류"}), 401

    data = request.get_json() or {}
    user.bio = data.get("bio", user.bio)
    user.avatar_url = data.get("avatar_url", user.avatar_url)
    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


@bp.put("/me/password")
@jwt_required()
def change_password():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({"message": "인증 오류"}), 401

    data = request.get_json() or {}
    current_pw = data.get("current_password")
    new_pw = data.get("new_password")
    if not current_pw or not new_pw:
        return jsonify({"message": "필수 항목 누락"}), 400

    if not user.check_password(current_pw):
        return jsonify({"message": "현재 비밀번호 불일치"}), 400

    user.set_password(new_pw)
    db.session.commit()
    return jsonify({"message": "비밀번호 변경 완료"}), 200


@bp.delete("/me")
@jwt_required()
def delete_me():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({"message": "인증 오류"}), 401

    # 아바타 파일 삭제 (있는 경우)
    delete_avatar_file(user.avatar_url)

    user.is_active = False
    db.session.commit()
    return jsonify({"message": "회원탈퇴 처리(비활성화)"}), 200


@bp.post("/me/avatar")
@jwt_required()
def upload_avatar():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({"message": "인증 오류"}), 401

    if 'avatar' not in request.files:
        return jsonify({"message": "파일이 없습니다"}), 400
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({"message": "파일이 선택되지 않았습니다"}), 400
    
    # 파일 확장자 검사
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
        return jsonify({"message": "지원하지 않는 파일 형식입니다"}), 400
    
    try:
        # 파일 저장 디렉토리 생성
        upload_folder = os.path.join(current_app.root_path, '..', 'static', 'avatars')
        os.makedirs(upload_folder, exist_ok=True)
        
        # 고유한 파일명 생성
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4()}.{file_extension}"
        filepath = os.path.join(upload_folder, filename)
        
        # 이미지 처리 및 저장
        image = Image.open(file.stream)
        
        # 이미지 크기 조정 (최대 300x300)
        image.thumbnail((300, 300), Image.Resampling.LANCZOS)
        
        # 이미지 저장
        image.save(filepath, quality=85, optimize=True)
        
        # 기존 아바타 파일 삭제 (있는 경우)
        delete_avatar_file(user.avatar_url)
        
        # 데이터베이스에 아바타 URL 저장
        avatar_url = f"/static/avatars/{filename}"
        user.avatar_url = avatar_url
        db.session.commit()
        
        return jsonify({
            "message": "프로필 사진이 업로드되었습니다",
            "avatar_url": avatar_url
        }), 200
        
    except Exception as e:
        return jsonify({"message": f"파일 업로드 중 오류가 발생했습니다: {str(e)}"}), 500
