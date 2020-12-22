"""empty message

Revision ID: b9870883aa56
Revises: efb436cb06f1
Create Date: 2020-12-20 18:31:30.040537

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b9870883aa56'
down_revision = 'efb436cb06f1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'collection', 'user', ['owner'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'collection', type_='foreignkey')
    # ### end Alembic commands ###