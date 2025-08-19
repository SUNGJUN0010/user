from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User

bp = Blueprint("users", __name__, url_prefix="/api/users")


@bp.put("/me")
@jwt_required()
def update_me():
    identity = get_jwt_identity()
    user = User.query.get(identity["id"]) if isinstance(identity, dict) else None
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
    user = User.query.get(identity["id"]) if isinstance(identity, dict) else None
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
    user = User.query.get(identity["id"]) if isinstance(identity, dict) else None
    if not user:
        return jsonify({"message": "인증 오류"}), 401

    user.is_active = False
    db.session.commit()
    return jsonify({"message": "회원탈퇴 처리(비활성화)"}), 200
