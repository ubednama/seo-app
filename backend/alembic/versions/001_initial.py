"""Initial migration - create seo_reports table

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create seo_reports table
    op.create_table('seo_reports',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=True),
        sa.Column('meta_description', sa.String(length=500), nullable=True),
        sa.Column('h1_tags', sa.JSON(), nullable=True),
        sa.Column('h2_tags', sa.JSON(), nullable=True),
        sa.Column('images', sa.JSON(), nullable=True),
        sa.Column('links', sa.JSON(), nullable=True),
        sa.Column('load_time', sa.Float(), nullable=True),
        sa.Column('accessibility_score', sa.Float(), nullable=True),
        sa.Column('performance_score', sa.Float(), nullable=True),
        sa.Column('seo_score', sa.Float(), nullable=True),
        sa.Column('ai_insights', sa.Text(), nullable=True),
        sa.Column('ai_recommendations', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('ix_seo_reports_id', 'seo_reports', ['id'], unique=False)
    op.create_index('ix_seo_reports_url', 'seo_reports', ['url'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_seo_reports_url', table_name='seo_reports')
    op.drop_index('ix_seo_reports_id', table_name='seo_reports')
    
    # Drop table
    op.drop_table('seo_reports')