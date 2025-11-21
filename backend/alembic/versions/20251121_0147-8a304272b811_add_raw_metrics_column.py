"""
add raw_metrics column

Revision ID: 8a304272b811
Revises: 001_initial
Create Date: 2025-11-21 01:47:16.171009+00:00

"""
from alembic import op
import sqlalchemy as sa

revision = '8a304272b811'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('seo_reports', sa.Column('raw_metrics', sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column('seo_reports', 'raw_metrics')
