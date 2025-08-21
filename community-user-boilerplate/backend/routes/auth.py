from flask import Blueprint, request, jsonify, current_app, make_response
from email_validator import validate_email, EmailNotValidError
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)
from datetime import datetime, timedelta
from ..extensions import db
from ..models import User
from ..utils.tokens import generate_reset_token, verify_reset_token
from ..utils.email import send_password_reset_email

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.post("/register")
def register():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not username or not email or not password:
        return jsonify({"message": "필수 항목 누락"}), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify({"message": "이메일 형식 오류"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"message": "이미 존재하는 사용자명/이메일"}), 409

    user = User(username=username, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"user": user.to_dict()}), 200
    


@bp.post("/login")
def login():
    data = request.get_json() or {}
    print(f"DEBUG: Received login data: {data}")
    
    email_or_username = (data.get("email_or_username") or "").strip()
    password = data.get("password") or ""
    
    print(f"DEBUG: email_or_username: '{email_or_username}', password length: {len(password)}")

    if not email_or_username:
        return jsonify({"message": "이메일/사용자명이 필요합니다"}), 422
    
    if not password:
        return jsonify({"message": "비밀번호가 필요합니다"}), 422

    user = User.query.filter((User.email == email_or_username.lower()) | (User.username == email_or_username)).first()
    
    print(f"DEBUG: Found user: {user.username if user else 'None'}")
    
    if not user:
        return jsonify({"message": "존재하지 않는 사용자입니다"}), 401
    
    print(f"DEBUG: Checking password for user: {user.username}")
    print(f"DEBUG: Stored password hash: {user.password_hash[:20]}...")
    
    if not user.check_password(password):
        print(f"DEBUG: Password check failed")
        return jsonify({"message": "비밀번호가 일치하지 않습니다"}), 401
    
    print(f"DEBUG: Password check successful")
    
    if not user.is_active:
        return jsonify({"message": "비활성화된 계정입니다"}), 401

    print(f"DEBUG: Updating last_login_at")
    user.last_login_at = datetime.utcnow()
    db.session.commit()
    print(f"DEBUG: Database updated successfully")

    print(f"DEBUG: Creating JWT tokens")
    identity = str(user.id)
    print(f"DEBUG: Identity: {identity}")
    
    try:
        access_token = create_access_token(identity=identity)
        print(f"DEBUG: Access token created: {access_token[:20]}...")
        refresh_token = create_refresh_token(identity=identity)
        print(f"DEBUG: Refresh token created: {refresh_token[:20]}...")
    except Exception as e:
        print(f"DEBUG: JWT token creation error: {e}")
        return jsonify({"message": "토큰 생성 중 오류가 발생했습니다"}), 500

    print(f"DEBUG: Creating response")
    try:
        resp = make_response(jsonify({
            "access_token": access_token,
            "user": user.to_dict(),
        }))
        print(f"DEBUG: Response created successfully")
        
        # httpOnly 쿠키에 refresh 토큰 저장
        set_refresh_cookies(resp, refresh_token)
        print(f"DEBUG: Refresh cookies set successfully")
        
        print(f"DEBUG: Login successful for user: {user.username}")
        return resp, 200
    except Exception as e:
        print(f"DEBUG: Response creation error: {e}")
        return jsonify({"message": "응답 생성 중 오류가 발생했습니다"}), 500


@bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    resp = make_response(jsonify({"access_token": access_token}))
    return resp, 200


@bp.post("/logout")
@jwt_required(optional=True)
def logout():
    resp = make_response(jsonify({"message": "로그아웃 완료"}))
    unset_jwt_cookies(resp)
    return resp, 200


@bp.post("/forgot-password")
def forgot_password():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        return jsonify({"message": "이메일 필요"}), 400

    user = User.query.filter_by(email=email).first()
    # 보안상 존재여부 노출 최소화
    if user:
        token = generate_reset_token(email)
        minutes = current_app.config.get("RESET_TOKEN_EXPIRES_MIN", 30)
        reset_url = f"{request.host_url.rstrip('/')}/reset-password?token={token}"
        send_password_reset_email(email, reset_url)
        return jsonify({"message": "재설정 메일(시뮬레이션) 발송", "expires_min": minutes}), 200

    return jsonify({"message": "재설정 메일(시뮬레이션) 발송"}), 200


@bp.post("/forgot-username")
def forgot_username():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        return jsonify({"message": "이메일 필요"}), 400

    user = User.query.filter_by(email=email).first()
    # 보안상 존재여부 노출 최소화
    if user:
        # 실제로는 이메일 발송 로직이 들어가야 함
        print(f"DEBUG: 아이디 찾기 요청 - 이메일: {email}, 사용자명: {user.username}")
        return jsonify({"message": "아이디 찾기 메일(시뮬레이션) 발송"}), 200

    return jsonify({"message": "아이디 찾기 메일(시뮬레이션) 발송"}), 200


@bp.delete("/delete-account")
@jwt_required()
def delete_account():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    
    if not user:
        return jsonify({"message": "사용자를 찾을 수 없습니다"}), 404
    
    try:
        # 사용자 삭제
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "회원탈퇴가 완료되었습니다"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"DEBUG: 회원탈퇴 오류: {e}")
        return jsonify({"message": "회원탈퇴 중 오류가 발생했습니다"}), 500


@bp.post("/reset-password")
def reset_password():
    data = request.get_json() or {}
    token = data.get("token")
    new_password = data.get("new_password")
    if not token or not new_password:
        return jsonify({"message": "토큰/비밀번호 필요"}), 400

    minutes = current_app.config.get("RESET_TOKEN_EXPIRES_MIN", 30)
    email = verify_reset_token(token, minutes * 60)
    if not email:
        return jsonify({"message": "토큰 유효하지 않음"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "사용자 없음"}), 404

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "비밀번호 변경 완료"}), 200


@bp.get("/me")
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    if not user:
        return jsonify({"message": "인증 오류"}), 401
    return jsonify({"user": user.to_dict()}), 200
